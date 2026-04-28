#!/bin/bash

echo "ck-frontends $APP_VERSION"
su-exec nextjs "$@"

