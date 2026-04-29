terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
  #this bucket is configured to replicate its contents to the other zones, if us-east-1 goes down, replace it with any other zone, but be sure to replicate that one back to us-east-1 later
  backend "s3" {
    bucket         = "creditkey-terraform-state"
    key            = "ck-frontends/staging.tfstate"
    region         = "us-east-1"
    use_lockfile   = true
    # encrypt = true
  }
}

variable deploy_tier     { default = "staging" }

module "app-vars" {
  source = "../_shared"
  deploy_tier = var.deploy_tier
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
  default_tags {
    tags = {
      ck-service      = module.app-vars.app_name
      ck-tier         = var.deploy_tier
      ck-terraform    = "True"
    }
  }
}

module "ck-frontends_us-east-1" {
  providers = {
    aws = aws.us-east-1
  }

  source = "../_shared/ck-frontends"
  deploy_tier = var.deploy_tier
}

output "ck-ecs-env" {
  value = module.ck-frontends_us-east-1.ck-ecs-env
}
