#!/bin/bash

# Cloudflare API Verification Script
# Usage: ./verify_cloudflare_auth.sh [API_TOKEN] [ZONE_ID]

echo "🔍 Cloudflare API Credential Verifier"
echo "====================================="

# 1. Get API Token
TOKEN=$1
if [ -z "$TOKEN" ]; then
    # Try getting from environment
    TOKEN=$CLOUDFLARE_API_TOKEN
fi

if [ -z "$TOKEN" ]; then
    echo -n "Enter your Cloudflare API Token: "
    read -s TOKEN
    echo ""
fi

if [ -z "$TOKEN" ]; then
    echo "❌ Error: API Token is required."
    exit 1
fi

# 2. Get Zone ID
ZONE_ID=$2
DEFAULT_ZONE_ID="0e33fe0b0ba1dbbed0133a1319e078ad"

if [ -z "$ZONE_ID" ]; then
    # Try environment
    ZONE_ID=$CLOUDFLARE_ZONE_ID
fi

if [ -z "$ZONE_ID" ]; then
    echo -n "Enter Zone ID (default: $DEFAULT_ZONE_ID): "
    read INPUT_ZONE_ID
    if [ -z "$INPUT_ZONE_ID" ]; then
        ZONE_ID=$DEFAULT_ZONE_ID
    else
        ZONE_ID=$INPUT_ZONE_ID
    fi
fi

echo "-------------------------------------"
echo "Testing credentials..."
echo "Zone ID: $ZONE_ID"
echo "Token:   ${TOKEN:0:4}****"
echo "-------------------------------------"

# 3. Test 1: Verify Token (User Details)
echo "1️⃣  Testing Token Validity (getting user details)..."
USER_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json")

SUCCESS=$(echo $USER_RESPONSE | grep -o '"success":true')

if [ -n "$SUCCESS" ]; then
    echo "✅ Token is VALID."
else
    echo "❌ Token Verification Failed!"
    echo "Response: $USER_RESPONSE"
    
    # Check for Global API Key signature (approx 37 chars, hex)
    LEN=${#TOKEN}
    if [[ "$LEN" -eq 37 && "$TOKEN" =~ ^[0-9a-fA-F]+$ ]]; then
        echo ""
        echo "⚠️  DIAGNOSIS: This looks like a Global API Key ($LEN chars, hex)."
        echo "   The application uses API TOKENS (Bearer Auth), which are safer."
        echo "   Global Keys use 'X-Auth-Key' headers, which is not supported by default."
        echo ""
        echo "👉 SOLUTION: Create an API Token, not a Global Key."
        echo "   1. Go to https://dash.cloudflare.com/profile/api-tokens"
        echo "   2. Click 'Create Token' -> Use template 'Edit Zone DNS'"
        echo "   3. Use THAT token (usually starts with a letter, ~40 chars)."
    fi
    exit 1
fi

echo "-------------------------------------"

# 4. Test 2: Verify Zone Access (List Custom Hostnames)
echo "2️⃣  Testing Zone Access (listing first 1 custom hostname)..."
ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/custom_hostnames?per_page=1" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json")

ZONE_SUCCESS=$(echo $ZONE_RESPONSE | grep -o '"success":true')

if [ -n "$ZONE_SUCCESS" ]; then
    echo "✅ Zone Access Successful!"
    echo "   (This confirms the backend should work if configured with these credentials)"
else
    echo "❌ Zone Access Failed!"
    echo "   Error: Could not list custom hostnames for Zone ID: $ZONE_ID"
    echo "   Response: $ZONE_RESPONSE"
    echo ""
    echo "👉 Tip: Ensure your API Token has 'Zone > Custom Hostnames > Read/Edit' permissions."
    exit 1
fi

echo "====================================="
echo "🎉 ALL CHECKS PASSED"
echo "You can confidently set these credentials in your backend environment."
