#!/bin/sh
BASE_TEST_PATH=./test/

if [ -z "$1" ];  then
    echo "This will test every function-service in this project."
    TEST_PATH="${BASE_TEST_PATH}*"
else
    echo "This will test the function service '$1'."
    TEST_PATH="${BASE_TEST_PATH}$1"
fi

for FILE in $TEST_PATH
do
    if test -d $FILE
    then
        FUNCTION_SERVICE_NAME="${FILE#$BASE_TEST_PATH}"
        echo "Testing $FUNCTION_SERVICE_NAME"

        docker run --user root --rm \
            --env FUNCTIONS_FOLDER=./volume/functions \
            -v $(pwd)/test/${FUNCTION_SERVICE_NAME}:/home/node/app/volume/tests \
            -v $(pwd)/config-maps/${FUNCTION_SERVICE_NAME}:/home/node/app/volume/functions \
            nexus.mia-platform.eu/core/function-service \
            ./run-test.sh \
        || { echo "Tests for ${FUNCTION_SERVICE_NAME} failed" ; exit 1; }
    fi
done
