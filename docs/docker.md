# docker



### Local Docker Build

multi-platform, multi-stage, multi-module local build

login to GHCR first.

```shell
export GITHUB_PACKAGES_TOKEN=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
echo $GITHUB_PACKAGES_TOKEN | docker login ghcr.io -u xmlking --password-stdin
```

Build and publish docker image to ghcr.io

```shell
#VERSION=$(git describe --tags || echo "HEAD")
VERSION=v0.1.0
BUILD_DATE=$(date +%FT%T%Z)
REGISTRY=ghcr.io
IMAGE_NAME=xmlking/svelte-starter-kit
DOCKER_IMAGE=$REGISTRY/$IMAGE_NAME

# build
export DOCKER_CLI_EXPERIMENTAL=enabled
docker buildx create --use

docker buildx build --platform linux/arm64,linux/amd64 \
-t $DOCKER_IMAGE\:$VERSION \
-t $DOCKER_IMAGE\:latest \
--build-arg BUILD_DATE=$BUILD_DATE --build-arg VERSION=$VERSION \
--push .

# inspect
docker buildx imagetools inspect $DOCKER_IMAGE:$VERSION
docker buildx imagetools inspect --raw $DOCKER_IMAGE:$VERSION
docker inspect --format "{{.Architecture}}" $DOCKER_IMAGE:$VERSION

# run
docker run -it --rm --platform linux/arm64 -p 3000:3000 \
-e NODE_ENV=production CONFY_ENGINE_ENDPOINT=20.232.141.148:8080 -e CONFY_PAYMENT_ENDPOINT=20.232.141.148:8080 \
$DOCKER_IMAGE:$VERSION
docker run -it --rm --platform linux/amd64 -p 3000:3000 \
-e NODE_ENV=production CONFY_ENGINE_ENDPOINT=20.232.141.148:8080 -e CONFY_PAYMENT_ENDPOINT=20.232.141.148:8080 \
$DOCKER_IMAGE:$VERSION

## (or)
docker compose up

## Debug
# when built from `FROM gcr.io/distroless/nodejs:18-debug`, you can debug by running:
docker run --rm -it --entrypoint=sh $DOCKER_IMAGE:$VERSION
# other option to explore docker image is via dive
dive $DOCKER_IMAGE:$VERSION
```

Sign Docker image and push with Keyless mode

```shell
#nerdctl push --sign=cosign ghcr.io/xmlking/svelte-starter-kit:$VERSION
COSIGN_EXPERIMENTAL=1 cosign $DOCKER_IMAGE:$VERSION
```

Verify the image with Keyless mode

```shell
#nerdctl pull --verify=cosign ghcr.io/xmlking/svelte-starter-kit:$VERSION
COSIGN_EXPERIMENTAL=1 cosign verify $DOCKER_IMAGE:$VERSION
```
