FROM nginx:1.23.3-alpine as build

WORKDIR /etc/nginx

COPY LICENSE nginx ./

RUN rm -fr /etc/nginx/conf.d/* \
  && touch ./off \
  && mkdir -p /usr/static \
  && chmod ugo+rw ./off /usr/static

USER nginx

WORKDIR /build-dir

COPY ./build .

COPY LICENSE .

RUN echo "mia-platform-docs: $COMMIT_SHA" >> ./commit.sha

################################################################################à

FROM nginx:1.23.3-alpine

LABEL maintainer="Mia Platform Core Team<core@mia-platform.eu>" \
  name="Documentation" \
  description="Mia-Platform documentation website" \
  eu.mia-platform.url="https://www.mia-platform.eu" \
  eu.mia-platform.version="0.0.0"

COPY nginx/permanent.redirects ./conf.d/permanent.redirects
COPY nginx/website.conf ./conf.d/website.conf

WORKDIR /usr/static

COPY --from=build /build-dir ./

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
