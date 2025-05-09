

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
output bitbucket_repo_uuid {
  value = "{07372369-aedd-4d57-91ff-6f7028d6b7ff}"
}
output bitbucket_env_uuid {
  value = {
    "development": "{0a174704-8742-4827-9943-43531bd9977c}",
    "staging":     "{29920298-7c41-48f8-b6e5-41051aff5282}",
    "production":  "{5667e09a-5c4c-4203-9c89-e17da3c81834}",
  }[var.deploy_tier]
}
