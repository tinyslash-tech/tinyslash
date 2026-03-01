#!/bin/bash

# Load Environment Variables from ../../.env
export PROD_MONGODB_URI=$(grep "^PROD_MONGODB_URI=" ../../.env | cut -d '=' -f2-)
export MONGODB_URI="$PROD_MONGODB_URI"

# Load other credentials
export GOOGLE_CLIENT_ID=$(grep "^GOOGLE_CLIENT_ID=" ../../.env | cut -d '=' -f2-)
export GOOGLE_CLIENT_SECRET=$(grep "^GOOGLE_CLIENT_SECRET=" ../../.env | cut -d '=' -f2-)
export R2_ACCESS_KEY_ID=$(grep "^R2_ACCESS_KEY_ID=" ../../.env | cut -d '=' -f2-)
export R2_SECRET_ACCESS_KEY=$(grep "^R2_SECRET_ACCESS_KEY=" ../../.env | cut -d '=' -f2-)
export R2_ENDPOINT=$(grep "^R2_ENDPOINT=" ../../.env | cut -d '=' -f2-)
export R2_BUCKET_NAME=$(grep "^R2_BUCKET_NAME=" ../../.env | cut -d '=' -f2-)
export R2_PUBLIC_DOMAIN=$(grep "^R2_PUBLIC_DOMAIN=" ../../.env | cut -d '=' -f2-)
export FILE_STORAGE_TYPE=$(grep "^FILE_STORAGE_TYPE=" ../../.env | cut -d '=' -f2-)
export CACHE_TYPE=$(grep "^CACHE_TYPE=" ../../.env | cut -d '=' -f2-)
export JWT_SECRET=$(grep "^JWT_SECRET=" ../../.env | cut -d '=' -f2-)
export BACKEND_URL=$(grep "^BACKEND_URL=" ../../.env | cut -d '=' -f2-)
export FRONTEND_URL=$(grep "^FRONTEND_URL=" ../../.env | cut -d '=' -f2-)
export SHORT_URL_DOMAIN=$(grep "^SHORT_URL_DOMAIN=" ../../.env | cut -d '=' -f2-)
export OPENAI_API_KEY=$(grep "^OPENAI_API_KEY=" ../../.env | cut -d '=' -f2-)

# Load Resend API Keys manually before Maven boot
export RESEND_API_KEY=$(grep "^RESEND_API_KEY=" ../../.env | cut -d '=' -f2-)
export RESEND_FROM_AUTH=$(grep "^RESEND_FROM_AUTH=" ../../.env | cut -d '=' -f2-)
export RESEND_FROM_NOTIFICATIONS=$(grep "^RESEND_FROM_NOTIFICATIONS=" ../../.env | cut -d '=' -f2-)
export RESEND_FROM_UPDATES=$(grep "^RESEND_FROM_UPDATES=" ../../.env | cut -d '=' -f2-)

# Redis Configuration
export REDIS_HOST=$(grep "^REDIS_HOST=" ../../.env | cut -d '=' -f2-)
export REDIS_PORT=$(grep "^REDIS_PORT=" ../../.env | cut -d '=' -f2-)
export REDIS_PASSWORD=$(grep "^REDIS_PASSWORD=" ../../.env | cut -d '=' -f2-)
export REDIS_DATABASE=$(grep "^REDIS_DATABASE=" ../../.env | cut -d '=' -f2-)
export REDIS_TIMEOUT=$(grep "^REDIS_TIMEOUT=" ../../.env | cut -d '=' -f2-)

# Map to Spring Data Redis properties (overriding defaults in RedisConfig.java)
export SPRING_DATA_REDIS_HOST="$REDIS_HOST"
export SPRING_DATA_REDIS_PORT="$REDIS_PORT"
export SPRING_DATA_REDIS_PASSWORD="$REDIS_PASSWORD"
export SPRING_DATA_REDIS_DATABASE="$REDIS_DATABASE"
export SPRING_DATA_REDIS_TIMEOUT="$REDIS_TIMEOUT"
export SPRING_DATA_REDIS_SSL_ENABLED="true"

echo "✅ Environment configured for PRODUCTION (local run)."
echo "Using MongoDB URI: $PROD_MONGODB_URI"
echo "⚠️  Redis port 6380 is blocked locally — using simple in-memory cache instead."

# Override cache type to simple (in-memory) since Upstash Redis port 6380
# is typically blocked by local ISP/firewalls. Production MongoDB is still used.
export CACHE_TYPE=simple

# Run the application with prod profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod -Dspring-boot.run.jvmArguments="-Dspring.cache.type=simple -Dresend.api.key=$RESEND_API_KEY -Dresend.from.auth=$RESEND_FROM_AUTH -Dresend.from.notifications=$RESEND_FROM_NOTIFICATIONS -Dresend.from.updates=$RESEND_FROM_UPDATES"
