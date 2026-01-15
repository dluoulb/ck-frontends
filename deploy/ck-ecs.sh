#!/bin/bash

set -e #exit on error
# set -x #output commands

cd "$(dirname "$0")"

TF_ENV="ck"
ACTION="$1"
shift
if [[ "$ACTION" = "-tf-env" ]]; then
  TF_ENV="$1"
  shift
  ACTION="$1"
  shift
elif [[ $ACTION =~ -tf-env=(.*) ]]; then
  TF_ENV="${BASH_REMATCH[1]}"
  ACTION="$1"
  shift
fi
TF_ENV="${TF_ENV}-ecs-env"

TARGET="$1"
shift || echo -n
if [[ $ACTION =~ ^(ecr_labels)$ ]]; then
  TARGET=${TARGET:-build}
elif [[ $ACTION =~ ^(status)$ ]]; then
  :
else
  target_types="development|staging|production"
  if [[ ! " $TARGET " =~ .*\ ($target_types)\ *. ]]; then
    if [[ " $ACTION " =~ .*\ ($target_types)\ *. ]]; then
      echo "Usage: $0 <command> <$target_types>"
    else
      echo "TARGET must be one of $target_types for command: $ACTION"
    fi
    exit 1
  fi
fi

if ! [[ $ACTION =~ ^(terraform|run-now)$ ]]; then
  if [ "$#" -ge 1 ]; then
    TARGET_TYPE="$1"
    shift
  fi
fi

APP_ROOT_DIR="$(pwd)/.."
cd $APP_ROOT_DIR

inform () {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S' | tr '\n' ' ' | xargs echo)]" "$@"
}

build_image () {
  APP_VERSION
  inform "Building $VERSION_INFO"
  docker build \
    -t "$IMAGE_NAME:$TARGET" \
    -t $DEPLOY_IMAGE \
    --label "APP_VERSION=$APP_VERSION" \
    --build-arg APP_VERSION="$APP_VERSION" \
    --build-arg DEPLOY_TARGET="$TARGET" \
    --build-arg FONTAWESOME_NPM_AUTH_TOKEN="$FONTAWESOME_NPM_AUTH_TOKEN" \
    .

    docker tag $DEPLOY_IMAGE $ECR_TARGET

  # if [[ -n "$ECS_DEPLOY_TASKS_DEF" ]]; then
  #   pushd deploy/deploy-tasks
  #     inform "Building $VERSION_INFO (deploy tasks)"
  #     docker build --platform linux/amd64 -t "$IMAGE_NAME:${TARGET}-deploy-tasks" \
  #       -t $DEPLOY_TASKS_IMAGE \
  #       --cache-from "$IMAGE_NAME:${TARGET}" \
  #       --label "APP_VERSION=$APP_VERSION" \
  #       --build-arg APP_VERSION="$APP_VERSION" \
  #       --build-arg DEPLOY_TARGET="$TARGET" \
  #       .
  #     docker tag $DEPLOY_TASKS_IMAGE $DEPLOY_TASKS_ECR_TARGET
  #   popd
  # fi

  inform "Built $VERSION_INFO"
}

push_image () {
  APP_VERSION=$(docker inspect -f '{{.Config.Labels.APP_VERSION}}' "${IMAGE_NAME}:$TARGET")
  export AWS_PAGER=""

  # tag the existing $TARGET-previous with $TARGET-previous2 to preserve a second rollback targets
  MANIFEST=$(aws ecr batch-get-image --region="$ECS_REGION" --repository-name $ECR_NAME --image-ids "imageTag=$TARGET-previous" --output json | jq --raw-output '.images[0].imageManifest')
  aws ecr put-image --region="$ECS_REGION" --repository-name $ECR_NAME --image-tag "$TARGET-previous2" --image-manifest "$MANIFEST" | jq .image.imageId || true

  # # tag the existing $TARGET with $TARGET-previous to preserve the first rollback target
  MANIFEST=$(aws ecr batch-get-image --region="$ECS_REGION" --repository-name $ECR_NAME --image-ids "imageTag=$TARGET" --output json | jq --raw-output '.images[0].imageManifest')
  aws ecr put-image --region="$ECS_REGION" --repository-name $ECR_NAME --image-tag "$TARGET-previous" --image-manifest "$MANIFEST" | jq .image.imageId || true

  aws ecr get-login-password --region="$ECS_REGION" | docker login --username AWS --password-stdin $ECR_BASE
  if [[ -n "$ECS_DEPLOY_TASKS_DEF" ]]; then
    docker push $DEPLOY_TASKS_ECR_TARGET
  fi
  docker push $ECR_TARGET

  inform "Finished pushing $VERSION_INFO"
}

test_image () {
  set -x
  docker build --platform linux/amd64 -t "$IMAGE_NAME:test" \
    --target dev \
    --build-arg APP_VERSION="$APP_VERSION" \
    --build-arg DEPLOY_TARGET="$TARGET" \
    .

  inform "Testing $VERSION_INFO"
  docker run "$IMAGE_NAME:$TARGET" npm run test

  docker tag $DEPLOY_IMAGE $ECR_TARGET

  inform "Built $VERSION_INFO"
}

autodeploy () {
  echo "Preparing to deploy $VERSION_INFO"

  is_bank_holiday=$(python3 -c "from datetime import date; import holidays; today=date.today(); print('yes' if today in holidays.US(years=today.year) else 'no')")
  if [ "$is_bank_holiday" = "yes" ]; then
    echo "Exiting autodeploy on bank holidays"
    exit 1
  fi

  deploy
}

deploy () {
  APP_VERSION
  inform "Deploying $VERSION_INFO... "

  build_image
  push_image

  sleep 1
  restart

  if [[ "$TARGET" != "development" ]]; then
    if [ -n "$CI" ]; then
      git config user.name "CI Runner"
      git config user.email "runner@github"
    fi
    deploy_tag="${TARGET}-$(TZ="America/Los_Angeles" date +%Y-%m-%d_%H%M%S)"
    git tag -am "Tagging for release $deploy_tag" $deploy_tag
    git push origin $deploy_tag
  fi

  inform "Deployed $VERSION_INFO"
}

redeploy () {
  APP_VERSION
  inform "Redeploying..."

  run_deploy_tasks

  sleep 1
  restart

  inform "Done"
}

ecr_labels () {
  IMAGE="$TARGET"
  region="${2:-$ECS_REGION}"

  lookup_file=".ecr-labels.cache"
  if [ -f "$lookup_file" ]; then
    result=$(sed -n "/^$IMAGE/p" $lookup_file)
    if [[ "$result " != ' ' ]]; then
      echo $result | awk '{ print $2 }'
      exit
    fi
  fi

  if [[ "$IMAGE" =~ ^sha256:.* ]]; then
    IMAGE_ID="imageDigest='$IMAGE'"
  else
    IMAGE_ID="imageTag='$IMAGE'"
  fi

  MANIFEST=$(aws ecr batch-get-image --repository-name="$ECR_NAME" --image-id "$IMAGE_ID" --region="$region" --output json | jq -r '.images[].imageManifest')

  if [[ $MANIFEST == "" ]]; then
    echo "No results found for that Docker manifest"
    exit 1
  fi

  MEDIA_TYPE=$(jq '.mediaType' <<< "${MANIFEST}")

  if [[ $MEDIA_TYPE == '"application/vnd.docker.distribution.manifest.list.v2+json"' ]]; then
    INNER_DIGEST=$(jq '.manifests[0].digest' <<< "${MANIFEST}")
    MANIFEST=$(aws ecr batch-get-image --repository-name="$ECR_NAME" --image-id imageDigest=$INNER_DIGEST | jq -r '.images[].imageManifest')
  fi

  CONFIG_DIGEST=$(jq '.config.digest' <<< "${MANIFEST}")
  DOWNLOAD_URL=$(xargs -I{} aws --region="$region" ecr get-download-url-for-layer --repository-name="$ECR_NAME" --layer-digest={} <<< "${CONFIG_DIGEST}" | jq '.downloadUrl')
  CONTENT=$(xargs curl -s <<< "${DOWNLOAD_URL}")

  labels=$(echo $CONTENT | jq -c '.config.Labels')

  printf '%s\t%s\n' "$IMAGE" "$labels"  >> $lookup_file
  echo "$labels"
}

ecr_login () {
  aws ecr get-login-password --region="$region" | docker login --username AWS --password-stdin $ECR_BASE
}

logs () {
  if [ -z "$1" ]; then since="10m"; else since="$1"; fi

  echo "$(date -u +%Y-%m-%dT%H:%M:%S.%6N%:z) Tailing AWS CloudWatch logs for group $ECS_LOG_GROUP, starting from $since ago"
  aws logs tail "$ECS_LOG_GROUP" --since $since --follow
}

restart () {
  set -x
  aws ecs update-service --region="$ECS_REGION" --cluster="$ECS_CLUSTER" --service="$ECS_SERVICE" --force-new-deployment | jq '.service.deployments[0]'
}

start () {
  set -x
  aws ecs update-service --region="$ECS_REGION" --cluster="$ECS_CLUSTER" --service="$ECS_SERVICE" --desired-count 1 | jq '.service.deployments[0]'
}

stop () {
  set -x
  aws ecs update-service --region="$ECS_REGION" --cluster="$ECS_CLUSTER" --service="$ECS_SERVICE" --desired-count 0 | jq '.service.deployments[0]'
}

APP_VERSION () {
  APP_VERSION=$(git rev-parse --short HEAD)
  APP_BRANCH=$(git branch --show-current)
  if [[ $(git status --porcelain) ]]; then
    APP_VERSION="$APP_VERSION-$(git diff | md5sum | awk '{ print $1 }')"
  fi

  VERSION_INFO="$TARGET: $IMAGE_NAME=$APP_BRANCH@$APP_VERSION"
}

rel_fmt_low_precision() {
# https://unix.stackexchange.com/questions/364776/how-to-output-a-date-time-as-20-minutes-ago-or-9-days-ago-etc
    local SEC_PER_MINUTE=$((60))
    local   SEC_PER_HOUR=$((60*60))
    local    SEC_PER_DAY=$((60*60*24))
    local  SEC_PER_MONTH=$((60*60*24*30))
    local   SEC_PER_YEAR=$((60*60*24*365))

    dt=$(echo "$1" | cut -d'(' -f1)
    local last_unix="$(date --date="$dt" +%s)"
    local now_unix="$(date +'%s')"

    local delta_s=$(( now_unix - last_unix ))

    if (( delta_s <  SEC_PER_MINUTE * 2))
    then
        echo ""$((delta_s))"s"
        return
    elif (( delta_s <  SEC_PER_HOUR * 2))
    then
        echo ""$((delta_s / SEC_PER_MINUTE))"m"
        return
    elif (( delta_s <  SEC_PER_DAY * 2))
    then
        echo ""$((delta_s / SEC_PER_HOUR))"h"
        return
    elif (( delta_s <  SEC_PER_MONTH * 2))
    then
        echo ""$((delta_s / SEC_PER_DAY))"d"
        return
    elif (( delta_s <  SEC_PER_YEAR * 2))
    then
        echo ""$((delta_s / SEC_PER_MONTH))" months!"
        return
    else
        echo ""$((delta_s / SEC_PER_YEAR))" years!!"
        return
    fi
}

status () {
  REGIONS="us-east-1"
  TIERS="${TARGET:-staging production}"

  results=""
  for region in $REGIONS; do
    for tier in $TIERS; do
      cluster="$ECS_CLUSTER_BASE-${tier}"
      set +e
      taskids=$(aws ecs list-tasks --region="$region" --cluster="$cluster" --query taskArns 2>/dev/null)
      set -e

      if [[ " $taskids" != " []" ]] && [[ " $taskids" != " " ]]; then
        tasks=$(aws ecs describe-tasks --region="$region" --cluster="$cluster" --tasks "$taskids")

        imageDigests=$(echo "$tasks" | jq -r '(.tasks[].containers | map( select (.image |contains("amazonaws.com/$IMAGE_NAME:")) | .imageDigest )[0])')
        for sha in $(echo "$imageDigests" | grep -v '^null$' | sort | uniq); do
          sha_v=$(./deploy/ck-ecs.sh ecr_labels $sha | jq -r '.APP_VERSION')
          imageDigestsVersionMap=$"${imageDigestsVersionMap}$(echo -n $sha | cut -c1-17) ${sha_v}\n"
        done
        imageDigestsVersions=$(echo "$imageDigests" | cut -c1-17 | xargs -I {} bash -c "awk -vM='{}' '\$1==M { print \$2 }' <(echo -e '$imageDigestsVersionMap')")

        col_updated_at=$(echo "$tasks" | jq -r '.tasks[] | [.startedAt, .createdAt] | if .[0] != null then .[0][0:19] else .[1][0:19] + "(p)" end')
        col_region=$(echo "$col_updated_at" | sed "s/^.*$/$region/g")
        col_digests=$(echo "$imageDigests" | cut -c1-17)
        col_task_id_status_ip=$(echo "$tasks" | jq -r '(.tasks[].containers | map( select (.image |contains("amazonaws.com/$IMAGE_NAME:")) | .runtimeId[0:10], .healthStatus, .networkInterfaces[0].privateIpv4Address)) | join("\t")')
        col_task_def=$(echo "$tasks" | jq -r '.tasks[] | .taskDefinitionArn | capture(":task-definition/(?<td>.*)$").td')
        col_versions=$(echo "$imageDigestsVersions")

        result=$(paste \
            <(echo "$col_updated_at") \
            <(for v in $col_updated_at; do rel_fmt_low_precision $v; done) \
            <(echo "$col_region") \
            <(echo "$col_digests") \
            <(echo "$col_task_id_status_ip") \
            <(echo "$col_task_def") \
            <(echo "$col_versions")
        )

        results+=$(printf "\n%s\n" "$result")
      fi
    done
  done
  header='Updated At,ago,Region,ECR Image,Task ID,Status,IP Address,Task Def.,$IMAGE_NAME Version'
  echo -e "$header\n$(echo "$results" | awk ' { print $0 }' | sort -k6 -r | sed 's/\t/,/g')" | column -ts ','
}

check-terraform () {
  pushd ./deploy/terraform/deploy_tier/$TARGET > /dev/null
    if [[ ! -f ".terraform.lock.hcl" ]] || [[ ! -d ".terraform" ]]; then
      echo "Initializing terraform locally (this will only happen if this is a new checkout)"
      command terraform init
    fi
  popd > /dev/null
}

terraform () {
  terraform_cmd="$@"
  check-terraform 1>&2
  pushd ./deploy/terraform/deploy_tier/$TARGET > /dev/null
    command terraform $terraform_cmd
  popd > /dev/null
}

tf-env () {
  check-terraform 1>&2
  pushd ./deploy/terraform/deploy_tier/$TARGET > /dev/null
    terraform_vars="$(command terraform output -json ck-ecs-env | jq -r)"
    echo "$terraform_vars"
  popd > /dev/null

}

import_terraform_vars () {
  terraform_vars="$(tf-env)"
  set -o allexport
  source <(echo "$terraform_vars")
  set +o allexport
}

# set -x

if [[ ! $ACTION =~ ^(tf-env|terraform)$ ]]; then import_terraform_vars; fi
$ACTION $@
