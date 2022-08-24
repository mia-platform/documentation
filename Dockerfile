FROM nexus.mia-platform.eu/core/static-files:3.2.11 as build

USER root

WORKDIR /build-dir

COPY ./build .

COPY LICENSE .

RUN echo "mia-platform-docs: $COMMIT_SHA" >> ./commit.sha

################################################################################à

FROM nexus.mia-platform.eu/core/static-files:3.2.11

LABEL maintainer="Mia Platform Core Team<core@mia-platform.eu>" \
  name="Documentation" \
  description="Mia-Platform documentation website" \
  eu.mia-platform.url="https://www.mia-platform.eu" \
  eu.mia-platform.version="0.0.0"

COPY nginx/website.conf ./conf.d/website.conf

WORKDIR /usr/static

COPY --from=build /build-dir ./
