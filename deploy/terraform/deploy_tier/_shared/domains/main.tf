variable deploy_tier     {}
variable subdomain       {}

module "app-vars" {
  source = "../"
  deploy_tier = var.deploy_tier
}

locals {
  full_subdomain = var.deploy_tier != "production" ? "${var.subdomain}.${var.deploy_tier}" : "${var.subdomain}"
  domain = "${local.full_subdomain}.${module.app-vars.base_domain}"
}


module "ck-shared-vars" {
  source = "git@bitbucket.org:creditkey/ck-terraform-modules.git//ck-shared-vars?ref=v0.1.42"
  deploy_tier = var.deploy_tier
}

module "ck-frontends-domain" {
  source = "git@bitbucket.org:creditkey/ck-terraform-modules.git//route53?ref=v0.1.42"

  app_name = "ckfe-${var.subdomain}"
  deploy_tier = var.deploy_tier
  vpc_id = module.ck-shared-vars.vpc_id
  app_port = module.app-vars.app_port

  route53_zone_id = module.app-vars.route53_zone_id
  dns_name = local.domain

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
    matcher = "200" #TODO add a real healthcheck endpoint?
  }
}
