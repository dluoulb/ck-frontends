variable "deploy_tier" {}

module "app-vars" {
  source = "../"
  deploy_tier = var.deploy_tier
}

module "ck-shared-vars" {
  source = "git@bitbucket.org:creditkey/ck-terraform-modules.git//ck-shared-vars?ref=v0.1.30"
  deploy_tier = var.deploy_tier
}

module "ck-frontends" {
  source = "git@bitbucket.org:creditkey/ck-terraform-modules.git//ecs-app?ref=v0.1.30"

  app_name = module.app-vars.app_name
  deploy_tier = var.deploy_tier
  task_command = ["dumb-init","node","server.js"]
  task_entrypoint = [ "/usr/local/bin/entrypoint.sh" ]

  bitbucket_repo_uuid = module.app-vars.bitbucket_repo_uuid
  bitbucket_env_uuid = module.app-vars.bitbucket_env_uuid

  #networking
  app_port = module.app-vars.app_port
  vpc_id = module.ck-shared-vars.vpc_id
  subnet_ids = module.ck-shared-vars.subnet_ids
  cidr_block = module.ck-shared-vars.cidr_block

  #secrets
  dd_secret_arn = module.ck-shared-vars.dd_secret_arn
  app_secret_arn = module.app-vars.app_secret_arn

  #datadog logs
  kinesis_firehose_delivery_stream_arn = module.ck-shared-vars.kinesis_firehose_delivery_stream_arn

  #main task
  healthcheck_command = "lsof -Pi :${module.app-vars.app_port} -sTCP:LISTEN -t > /dev/null"
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent = 200

  vcpu = module.app-vars.vcpu
  memgb = module.app-vars.memgb

  route53_zone_id = module.app-vars.route53_zone_id
  base_domain = module.app-vars.base_domain
  subdomain = "borrower"

  alb_arn = module.ck-shared-vars.public_alb.arn
  alb_listener_arn = module.ck-shared-vars.public_alb.listener_arn
  alb_zone_id = module.ck-shared-vars.public_alb.zone_id
  alb_dns_name = module.ck-shared-vars.public_alb.dns_name
  alb_health_check = {
    path = "/api/_healthcheck"
    port = "${module.app-vars.app_port}"
    healthy_threshold = 5
    unhealthy_threshold = 5
    timeout = 5
    interval = 30
    matcher = "200"
  }
}

# module "ck-frontends-borrower" {
#   source = "../domains"
#   deploy_tier = var.deploy_tier
#   subdomain = "borrower"
# }

# module "ck-frontends-reports" {
#   source = "../domains"
#   deploy_tier = var.deploy_tier
#   subdomain = "reports"
# }

output "ck-ecs-env" {
  value = module.ck-frontends.ck-ecs-env
}
