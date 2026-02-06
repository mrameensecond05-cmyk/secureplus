#!/bin/bash

# Detect the local IP address
# This grabs the first IP address found.
IP=$(hostname -I | awk '{print $1}')

if [ -z "$IP" ]; then
    echo "Error: Could not detect IP address."
    exit 1
fi

echo "Detected Local IP: $IP"

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found."
    exit 1
fi

# Backup .env
cp "$ENV_FILE" "${ENV_FILE}.bak"

# Function to update or add a key-value pair
update_env() {
    local key=$1
    local value=$2
    if grep -q "^${key}=" "$ENV_FILE"; then
        sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
    else
        echo "${key}=${value}" >> "$ENV_FILE"
    fi
}

# Update SYSTEM_IP
update_env "SYSTEM_IP" "$IP"

# Update other URLs to use the detected IP
# We use the literal value instead of ${SYSTEM_IP} to ensure compatibility 
# with all consumers of the .env file (some simple parsers might not expand variables)
update_env "REACT_APP_API_URL" "http://$IP:5000"
update_env "VITE_API_URL" "http://$IP:5000/api"

echo "Updated $ENV_FILE:"
echo "  SYSTEM_IP=$IP"
echo "  REACT_APP_API_URL=http://$IP:5000"
echo "  VITE_API_URL=http://$IP:5000/api"

echo "Configuration complete. You can now run 'docker-compose up -d --build'"
