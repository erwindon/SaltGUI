#!/bin/sh
# build script with multi-architecture support (linux/amd64 and linux/arm64)
# Usage: ./build-and-upload.sh [--push] [--clean-before] [--clean-after]
#   Default: Build images locally only, reusing existing build cache
#   --push:         Build and push images to Docker registry
#   --clean-before: Clean builder before build (clears cache, forces fresh downloads)
#   --clean-after:  Clean local containers and images after build

set -ex

tag=3007.14

cd dockerfiles

# Check if push is requested
if [ "$1" = "--push" ]; then
  shift
  PUSH_IMAGES="--push"
  echo "Push mode enabled - images will be pushed to registry"
else
  PUSH_IMAGES=""
  echo "Build only mode - use '--push' parameter to push images to registry"
fi

# Check if clean-before is requested
if [ "$1" = "--clean-before" ]; then
  shift
  CLEAN_BEFORE="true"
  echo "Clean-before mode enabled - builder cache will be cleared"
else
  CLEAN_BEFORE="false"
fi

# Check if clean-after is requested
if [ "$1" = "--clean-after" ]; then
  shift
  CLEAN_AFTER="true"
  echo "Clean-after mode enabled - local images will be cleaned up after build"
else
  CLEAN_AFTER="false"
fi

if [ "$#" != 0 ]; then
  echo "Usage: $0 [--push] [--clean-before] [--clean-after]"
  exit 1
fi

# Setup buildx for multi-architecture builds
if [ "$CLEAN_BEFORE" = "true" ]; then
  # Remove builder to force fresh cache
  docker buildx rm multiarch 2>/dev/null || true
  docker buildx create --name multiarch --driver docker-container --use
else
  # Create builder only if it doesn't exist, reuse cache
  docker buildx create --name multiarch --driver docker-container --use 2>/dev/null || \
    docker buildx use multiarch
fi
docker buildx inspect --bootstrap

# Build function for multi-architecture images
build_multiarch_image() {
  dockerfile="dockerfile-$1"
  imagename="erwindon/saltgui-$1"
  echo "Building $imagename for multiple architectures (linux/amd64,linux/arm64)"
  docker buildx build --progress=plain --platform linux/amd64,linux/arm64 \
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

if [ "$CLEAN_AFTER" = "true" ]; then
  # Cleanup containers and dangling images
  docker container ls -aq | xargs --no-run-if-empty docker container rm --force
  docker images | awk '/^<none>/ {print $3;}' | xargs --no-run-if-empty docker rmi

  # Final cleanup
  docker system prune --force --filter "until=12h"
  docker images
fi

# End
