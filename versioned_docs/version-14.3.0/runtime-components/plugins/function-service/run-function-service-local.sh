#!/bin/sh
if [ -z "$1" ];  then
    echo "Usage: \t $0 function-service-name"
    echo "Example: $0 config-map-function-test"
    exit 1
else
    echo "This will run the function service '$1'."
    FUNCTION_SERVICE_NAME="$1"
fi

docker run -it -p 127.0.0.1:3000:3000 --rm \
  --env FUNCTIONS_FOLDER=./volume/functions \
  --env LOG_LEVEL=trace \
  --env USERID_HEADER_KEY=userid \
  --env GROUPS_HEADER_KEY=usergroups \
  --env CLIENTTYPE_HEADER_KEY=clienttype \
  --env BACKOFFICE_HEADER_KEY=isbackoffice \
  --env MICROSERVICE_GATEWAY_SERVICE_NAME=microservice-gateway \
  -v $(pwd)/config-maps/${FUNCTION_SERVICE_NAME}:/home/node/app/volume/functions \
  nexus.mia-platform.eu/core/function-service \
  npm start