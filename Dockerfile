FROM nginx:1.27.5-alpine

LABEL maintainer="Mia Platform Core Team<core@mia-platform.eu>" \
  name="Documentation" \
  description="Mia-Platform documentation website" \
  eu.mia-platform.url="https://www.mia-platform.eu"

WORKDIR /etc/nginx

COPY nginx .
RUN rm -rf nginx/conf.d

WORKDIR /usr/static

COPY ./build .

USER nginx
