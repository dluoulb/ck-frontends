

variable deploy_tier     {}
output app_name          { value = "ck-frontends" }
output app_port          { value = 3000 }
output route53_zone_id   { value = "Z3DWELT81HHRMS" }
output base_domain       { value = "creditkey.com" }

output vcpu {
  value = {
    "development": "0.5",
    "staging":     "0.5",
    "production":  "0.5",
  }[var.deploy_tier]
}
output memgb {
  value = {
    "development": "1",
    "staging":     "1",
    "production":  "1",
  }[var.deploy_tier]
}
output app_secret_arn {
  value = {
    "development": "arn:aws:secretsmanager:us-east-1:504947135646:secret:ck-frontends-development-pidTML",
    "staging":     "arn:aws:secretsmanager:us-east-1:504947135646:secret:ck-frontends-staging-0GTQc2",
    "production":  "arn:aws:secretsmanager:us-east-1:504947135646:secret:ck-frontends-production-wT2W9i",
  }[var.deploy_tier]
}
