#!/bin/bash
# docker/scripts/test-ssl-deployment.sh

set -e

echo "🔒 Testing Direct SSL SaltGUI Deployment (No Nginx)"

# Generate SSL certificates if they don't exist
if [ ! -f docker/ssl/saltgui.crt ]; then
    echo "📜 Generating SSL certificates..."
    chmod +x docker/scripts/generate-ssl-certs.sh
    ./docker/scripts/generate-ssl-certs.sh
fi

# Start SSL services
echo "🚀 Starting SSL services..."
cd docker
docker-compose -f docker-compose-ssl.yml down
docker-compose -f docker-compose-ssl.yml up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 45

# Test container health
echo "🏥 Checking container health..."
docker-compose -f docker-compose-ssl.yml ps

# Copy SaltGUI files to container
echo "📁 Copying SaltGUI files to container..."
docker cp ../saltgui/ docker-saltmaster-ssl-1:/saltgui

# Apply SSL state
echo "🔧 Applying SaltGUI SSL state..."
docker exec docker-saltmaster-ssl-1 salt-call --local grains.setval saltgui_master True
docker exec docker-saltmaster-ssl-1 salt-call --local state.apply saltgui-ssl

# Test direct HTTPS endpoint
echo "🧪 Testing direct HTTPS endpoint..."
sleep 10
curl -k -I https://localhost:8443/ | head -5

# Test SSL certificate
echo "🔍 Checking SSL certificate..."
echo | openssl s_client -connect localhost:8443 -servername localhost 2>/dev/null | openssl x509 -noout -subject

# Test security headers
echo "🛡️ Checking security headers..."
curl -k -I https://localhost:8443/ | grep -E "(Strict-Transport|X-Content|X-Frame|X-XSS)"

# Test authentication
echo "🔐 Testing SSL authentication..."
curl -k -X POST https://localhost:8443/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "salt", "password": "saltgui"}' | head -5

# Test minion connectivity
echo "🔗 Testing minion connectivity..."
sleep 5
docker exec docker-saltmaster-ssl-1 salt-key -L
docker exec docker-saltmaster-ssl-1 salt-key -A -y
sleep 5
docker exec docker-saltmaster-ssl-1 salt '*' test.ping

echo ""
echo "✅ Direct SSL testing complete!"
echo "🌐 Access SaltGUI at: https://localhost:8443"
echo "🔐 Login: salt / saltgui"
echo ""
echo "📋 To cleanup: docker-compose -f docker-compose-ssl.yml down"
