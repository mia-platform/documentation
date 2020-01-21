FROM nexus.mia-platform.eu/core/static-files:3.2.1

LABEL maintainer="Mia Platform Core Team<core@mia-platform.eu>" \
      name="Documentation Site" \
      description="Website for the documentation of the platform." \
      url="https://docs.mia-platform.eu"

ADD nginx/nginx.conf /etc/nginx/conf.d/

HEALTHCHECK --interval=30s --timeout=3s --retries=2 \
  CMD wget -sqO- http://localhost/index.html &> /dev/null || exit 1

COPY /site /usr/static
