#!/bin/sh
# build script with multi-architecture support (linux/amd64 and linux/arm64)
# Usage: ./build-and-upload.sh [--push]
#   Default: Build images locally only
#   --push:  Build and push images to Docker registry
set -ex

cd dockerfiles
tag=3007.6
# Check if push is requested
PUSH_IMAGES=""
if [ "$1" = "--push" ]; then
  PUSH_IMAGES="--push"
  echo "Push mode enabled - images will be pushed to registry"
else
  echo "Build only mode - use '--push' parameter to push images to registry"
fi

# Setup buildx for multi-architecture builds
# Remove any existing problematic builder
docker buildx rm multiarch 2>/dev/null || true
# Create a fresh builder with multi-platform support
docker buildx create --name multiarch --driver docker-container --use
docker buildx inspect --bootstrap

# Build function for multi-architecture images
build_multiarch_image() {
  dockerfile="dockerfile-$1"
  imagename="erwindon/saltgui-$1"
  echo "Building $imagename for multiple architectures (linux/amd64,linux/arm64)"
  docker buildx build --platform linux/amd64,linux/arm64 \
    -f "$dockerfile" \
    -t "$imagename:$tag" \
    -t "$imagename:latest" \
    $PUSH_IMAGES .
}

# Build all images with multi-architecture support
build_multiarch_image saltmaster
build_multiarch_image saltmaster-tls
build_multiarch_image saltminion-ubuntu
build_multiarch_image saltminion-debian
build_multiarch_image saltminion-centos

# Cleanup containers and dangling images
docker container ls -aq | xargs --no-run-if-empty docker container rm --force
docker images | awk '/^<none>/ {print $3;}' | xargs --no-run-if-empty docker rmi

# Final cleanup
docker system prune --force --filter "until=12h"
docker images
# End