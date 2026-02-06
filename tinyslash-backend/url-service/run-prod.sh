#!/bin/bash

# Load Production MongoDB URI from root .env
# We use the MONGODB_URI from .env as the PROD_MONGODB_URI
export PROD_MONGODB_URI=$(grep "^MONGODB_URI=" ../../.env | cut -d '=' -f2-)
export GOOGLE_CLIENT_ID=$(grep "^GOOGLE_CLIENT_ID=" ../../.env | cut -d '=' -f2-)
export GOOGLE_CLIENT_SECRET=$(grep "^GOOGLE_CLIENT_SECRET=" ../../.env | cut -d '=' -f2-)
export JWT_SECRET=$(grep "^JWT_SECRET=" ../../.env | cut -d '=' -f2-)

# Check if URI was found
if [ -z "$PROD_MONGODB_URI" ]; then
  echo "❌ Error: MONGODB_URI not found in ../../.env"
  exit 1
fi

echo "✅ Environment configured for PRODUCTION."
echo "Using MongoDB URI: $PROD_MONGODB_URI"

# Run Spring Boot with 'prod' profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
