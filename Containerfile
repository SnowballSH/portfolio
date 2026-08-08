FROM docker.io/oven/bun:1.3.13@sha256:bb35eafd10b2e969809384850ff0474ba36a491239d715864bc87787b4cdf0a4 AS bun

FROM docker.io/library/node:24-bookworm@sha256:f6d02cf1353049cf3658e6ce9ec03c6877a6479495f122062d195e2279d01055 AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /src
COPY . .
RUN bun install --frozen-lockfile
RUN bun run check
RUN bun run build

FROM docker.io/library/caddy:2@sha256:98eb57d882ccd5213d1688764db10c1ca2c58a1ca3a6717a3411ad798f7a423a
ARG SOURCE_COMMIT=unknown
LABEL org.opencontainers.image.source="https://github.com/SnowballSH/portfolio"
LABEL org.opencontainers.image.revision="${SOURCE_COMMIT}"
RUN apk add --no-cache libcap \
 && setcap -r /usr/bin/caddy \
 && apk del libcap
COPY Caddyfile.container /etc/caddy/Caddyfile
COPY --from=build /src/dist /srv
EXPOSE 8080
