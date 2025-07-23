#!/bin/bash
# docker/scripts/generate-ssl-certs.sh
mkdir -p docker/ssl

echo "🔐 Generating SSL certificates for SaltGUI..."

# Generate self-signed certificate for testing
openssl req -x509 -newkey rsa:4096 -keyout docker/ssl/saltgui.key \
    -out docker/ssl/saltgui.crt -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=SaltGUI/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,DNS:saltmaster-local,IP:127.0.0.1"

# Set proper permissions
chmod 600 docker/ssl/saltgui.key
chmod 644 docker/ssl/saltgui.crt

echo "✅ SSL certificates generated successfully!"
echo "Certificate: docker/ssl/saltgui.crt"
echo "Private Key: docker/ssl/saltgui.key"
