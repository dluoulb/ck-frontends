variable "deploy_tier" {}

module "app-vars" {
  source = "../"
  deploy_tier = var.deploy_tier
}

module "ck-frontends" {
  source = "git@bitbucket.org:creditkey/ck-terraform-modules.git//ecs-app?ref=v0.1.40"

  app_name = module.app-vars.app_name
  deploy_tier = var.deploy_tier
  task_command = ["dumb-init","node","server.js"]
  task_entrypoint = [ "/usr/local/bin/entrypoint.sh" ]

  bitbucket_repo = "n/a"

  app_port = module.app-vars.app_port
  app_secret_arn = module.app-vars.app_secret_arn

  healthcheck_command = "lsof -Pi :${module.app-vars.app_port} -sTCP:LISTEN -t > /dev/null"

  vcpu = module.app-vars.vcpu
  memgb = module.app-vars.memgb

  route53_zone_id = module.app-vars.route53_zone_id
  base_domain = module.app-vars.base_domain
  subdomain = "borrower"

  use_alb = "public"
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
