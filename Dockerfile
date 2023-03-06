FROM nginx:1.23.3-alpine

LABEL maintainer="Mia Platform Core Team<core@mia-platform.eu>" \
  name="Documentation" \
  description="Mia-Platform documentation website" \
  eu.mia-platform.url="https://www.mia-platform.eu"

COPY nginx /etc/nginx

WORKDIR /usr/static

COPY ./build .

USER nginx
