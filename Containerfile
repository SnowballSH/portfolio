FROM docker.io/oven/bun:1.4.3@sha256:ec06c3b6cea04192ae6770c434f668ca41d343ad19fa6472216c7b48be39c598 AS bun

FROM docker.io/library/node:24-bookworm@sha256:64af3819f9275802414d7cdc38c27e9d82bd564dec4d4da87d008255d36c63b4 AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /src
COPY . .
RUN bun install --frozen-lockfile
RUN bun run check
RUN bun run build

FROM docker.io/library/caddy:2@sha256:0c994536bddb66445885237f1a5dcc1916bccea922661c76b4e9fc24061f9b52
ARG SOURCE_COMMIT=unknown
LABEL org.opencontainers.image.source="https://github.com/SnowballSH/portfolio"
LABEL org.opencontainers.image.revision="${SOURCE_COMMIT}"
RUN apk add --no-cache libcap \
 && setcap -r /usr/bin/caddy \
 && apk del libcap
COPY Caddyfile.container /etc/caddy/Caddyfile
COPY --from=build /src/dist /srv
EXPOSE 8080
