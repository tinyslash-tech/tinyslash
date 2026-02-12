#!/bin/bash
echo "Setting up environment variables..."
export MONGODB_URI='mongodb+srv://<username>:<password>@cluster0.y8ucl.mongodb.net/pebly-database?retryWrites=true&w=majority'
export GOOGLE_CLIENT_ID='YOUR_GOOGLE_CLIENT_ID'
export GOOGLE_CLIENT_SECRET='YOUR_GOOGLE_CLIENT_SECRET'
export JWT_SECRET='YOUR_JWT_SECRET_KEY'

echo "Starting Spring Boot application with Production Database (y8ucl)..."
mvn spring-boot:run
