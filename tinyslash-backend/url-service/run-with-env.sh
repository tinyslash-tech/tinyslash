#!/bin/bash

# Explicitly set the MongoDB URI for Development (Read from .env)
# This ensures application-dev.yml can pick it up as ${DEV_MONGODB_URI}
export DEV_MONGODB_URI=$(grep "^MONGODB_URI=" ../../.env | cut -d '=' -f2-)

# Also set the standard MONGODB_URI just in case
export MONGODB_URI="$DEV_MONGODB_URI"

# Load Google Credentials from ../../.env (handling potential quoting issues manually)
export GOOGLE_CLIENT_ID=$(grep "^GOOGLE_CLIENT_ID=" ../../.env | cut -d '=' -f2-)
export GOOGLE_CLIENT_SECRET=$(grep "^GOOGLE_CLIENT_SECRET=" ../../.env | cut -d '=' -f2-)

# Load R2 Credentials
export R2_ACCESS_KEY_ID=$(grep "^R2_ACCESS_KEY_ID=" ../../.env | cut -d '=' -f2-)
export R2_SECRET_ACCESS_KEY=$(grep "^R2_SECRET_ACCESS_KEY=" ../../.env | cut -d '=' -f2-)
export R2_ENDPOINT=$(grep "^R2_ENDPOINT=" ../../.env | cut -d '=' -f2-)
export R2_BUCKET_NAME=$(grep "^R2_BUCKET_NAME=" ../../.env | cut -d '=' -f2-)
export R2_PUBLIC_DOMAIN=$(grep "^R2_PUBLIC_DOMAIN=" ../../.env | cut -d '=' -f2-)
export FILE_STORAGE_TYPE=$(grep "^FILE_STORAGE_TYPE=" ../../.env | cut -d '=' -f2-)
export OPENAI_API_KEY=$(grep "^OPENAI_API_KEY=" ../../.env | cut -d '=' -f2-)

echo "✅ Environment configured."
echo "Using MongoDB URI: $DEV_MONGODB_URI"
echo "Using Google Client ID: $GOOGLE_CLIENT_ID"

# Run the application
mvn spring-boot:run