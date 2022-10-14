# syntax=docker/dockerfile:1.4

# Add tini to act as PID1 for proper signal handling
FROM --platform=${BUILDPLATFORM} alpine as tini
ENV TINI_VERSION v0.19.0
# Use BuildKit to help translate architecture names
ARG TARGETPLATFORM
# translating Docker's TARGETPLATFORM into tini download names
RUN case ${TARGETPLATFORM} in \
		"linux/amd64")  TINI_ARCH=amd64  ;; \
		"linux/arm64")  TINI_ARCH=arm64  ;; \
		"linux/arm/v7") TINI_ARCH=armhf  ;; \
		"linux/arm/v6") TINI_ARCH=armel  ;; \
		"linux/386")    TINI_ARCH=i386   ;; \
    esac \
    && wget -q https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static-${TINI_ARCH} -O /tini \
    && chmod +x /tini

# This stage builds the application.
FROM --platform=${BUILDPLATFORM} node:18 as build-app
WORKDIR /app

COPY . .
# clean install all dependencies (except optional)
RUN npm ci --omit=optional --no-audit --unsafe-perm
# remove potential security issues
RUN npm audit fix
# build SvelteKit app
RUN npm run build:node

# This stage installs the runtime dependencies.
FROM --platform=${BUILDPLATFORM} node:18-alpine as build-runtime
WORKDIR /app
COPY package.json package-lock.json ./
# clean install dependencies, no devDependencies, no prepare script
#RUN --mount=type=cache,target=/root/.cache/node \
#    --mount=type=cache,target=/root/.cache/node-build \
#    npm ci --production --unsafe-perm --ignore-scripts

RUN npm ci --production --omit=optional --unsafe-perm --ignore-scripts
# remove potential security issues
RUN npm audit fix

# This stage only needs the compiled application and the runtime dependencies.
#FROM gcr.io/distroless/nodejs:18 as final
FROM gcr.io/distroless/nodejs:18-debug as final
ENV NODE_ENV production

WORKDIR /app
COPY --from=tini /tini /tini
ENTRYPOINT ["/tini", "-s", "--", "/nodejs/bin/node"]
COPY --from=build-app /app/build ./build
#COPY --from=build-app /app/config ./config
COPY --from=build-runtime /app/package.json ./package.json
COPY --from=build-runtime /app/node_modules ./node_modules

EXPOSE 3000
#USER nonroot:nonroot

# Metadata params
ARG TARGET=svelte-starter-kit
ARG DOCKER_REGISTRY=ghcr.io
ARG DOCKER_CONTEXT_PATH=xmlking
ARG BUILD_DATE
ARG VERSION
ARG VCS_URL=svelte-starter-kit
ARG VCS_REF=1
ARG VENDOR=xmlking

# Metadata
LABEL org.opencontainers.image.created=$BUILD_DATE \
    org.opencontainers.image.name="${TARGET}" \
    org.opencontainers.image.title="${TARGET}" \
    org.opencontainers.image.description="Example of SvelteKit multi-stage docker build" \
    org.opencontainers.image.url=https://github.com/xmlking/$VCS_URL \
    org.opencontainers.image.source=https://github.com/xmlking/$VCS_URL \
    org.opencontainers.image.revision=$VCS_REF \
    org.opencontainers.image.version=$VERSION \
    org.opencontainers.image.authors=sumanth \
    org.opencontainers.image.vendor=$VENDOR \
    org.opencontainers.image.ref.name=$VCS_REF \
    org.opencontainers.image.licenses=MIT \
    org.opencontainers.image.documentation="docker run -it -e NODE_ENV=production -p 3000:3000  ${DOCKER_REGISTRY:+${DOCKER_REGISTRY}/}${DOCKER_CONTEXT_PATH}/${TARGET}:${VERSION}"

CMD ["build"]
