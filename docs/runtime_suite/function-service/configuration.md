---
id: configuration
title:  Function Service
sidebar_label: Function Service
---
## Intro

The function service lets you map code to endpoints without provisioning a fully-fledged dedicated microservice.

You can create several function services within the same  _DevOps Console project_.
You have to create the scripts both for local and remote unit testing only for the first function service. The subsequently created ones will share the same scripts.

## Setup

The following steps will walk you through the setup of the needed scripts.

### Run the function service locally

You can locally start the function service to test and develop the handlers without the need of deploying to the cloud.

To run the function service clone the _DevOps Console project_ and create a script in the configuration root named ```run-function-service-local.sh```, containing:

```bash
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
```

### Unit testing and continuous testing

Every function service handler should be bundled with unit tests. The tests should be started locally, before each commit.
To achieve continuous testing we provide a Gitlab's pipeline stage to remotely run the unit tests.

To setup the unit testing create a script in the configuration root named ```run-function-service-tests.sh```, containing:

```bash
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
```

To setup continuous testing you should append the following pipeline stage to the ```.gitlab-ci.yml``` file.

```yaml
integration:
  stage: release
  image: docker:19.03.12

  variables:
    DOCKER_TLS_CERTDIR: "/certs"

  services:
    - docker:19.03.12-dind

  before_script:
    - docker info
    - docker login -u ${NEXUS_USER} -p ${NEXUS_TOKEN} ${NEXUS_URL}

  coverage: '/^Statements\s*:\s*([^%]+)/'

  script:
    - ./run-function-service-tests.sh

  only:
    variables:
      - $RUN_INTEGRATION_TESTS == "TRUE"
```

The setup phase is over.

## Create a function from the DevOps Console

To deploy a new function service, open the _DevOps Console_ add a new microservice choosing the docker image ```nexus.mia-platform.eu/core/function-service```.

Then, create a new configuration for this microservice and call it as you wish, (e.g.: _my-function-service_).
Type ```/home/node/app/functions``` as _run-time mount point_.

To add a new endpoint to the function service, click on _Add file_, call it as you prefer (e.g.: _hello.js_) and type the JavaScript code. It must export the following **required fields**:

- **method**: Request method _(e.g. POST, GET, PATCH ...)_
- **path**: Endpoint path _(e.g. /hello-world)_
- **name**: Friendly name for this function.
- **handler**: The function executed when the endpoint is reached.
- **schema**: JSON schema for the request and reply.

Libraries already included as dependencies:

* lodash
* fs

:::warning
Warning! You have to create the function file from the DevOps Console, not from the project repository.
:::

:::warning
Every time you change the function code (either from the DevOps Console or the repository) you should '_commit and regenerate_'
:::

*_hello.js_ example:*

```javascript
'use strict'

const schema = {
    body: {},
    response: {
        '200': {
            type: 'object',
            properties: {
                'text': {type: 'string'},
            },
        },
    },
}

async function handler(req, res) {
    res.send({
        'text': 'hello-world',
    })
}

module.exports = {
    method: 'POST',
    path: '/hello-world',
    name: 'Hello World',
    handler,
    schema,
}
```

Now click *Commit & deploy*, the newly created endpoint will be exposed and testable right away.

The env ```FUNCTIONS_FOLDER``` holds the path to the directory containing the definitions of the functions,
you are free to customize it and mount there any function.
When ```FUNCTIONS_FOLDER``` is not specified it defaults to ```/home/node/app/functions```.
Anyway, you should always create the ```FUNCTIONS_FOLDER``` directory using the "Add configuration" feature on the DevOps Console in order to have it correctly mounted on the microservice.

## Run the function service locally

To test the function service locally, clone the DevOps Console configuration repository, then run the script in the configuration root named ```run-function-service-local.sh```.

Add as extra argument the name of the function-service you want to bootstrap
(e.g.: _./run-function-service-local.sh config-map-my-function-service_).

## Unit testing

### Setup

To set up unit tests of your endpoints, clone the DevOps Console configuration repository and create a directory to hold the tests. It must follow the naming convention: ```test/config-map- %function-service-name%``` (e.g.: _test/config-map-my-function-service_).
In this directory, you can place the unit test files whose name must end with .test.js

### Create a test

**Example: test/config-map-my-function-service/index.test.js**

```javascript
'use strict'

const t = require('tap')
const lc39 = require('@mia-platform/lc39')

async function setupFastify(envVariables) {
  const fastify = await lc39('./index.js', {
    logLevel: envVariables.LOG_LEVEL,
    envVariables,
  })
  return fastify
}

t.test('functions-service', async t => {
  const fastify = await setupFastify({
    LOG_LEVEL: 'trace',
    USERID_HEADER_KEY: 'userid',
    GROUPS_HEADER_KEY: 'groups',
    CLIENTTYPE_HEADER_KEY: 'clienttype',
    BACKOFFICE_HEADER_KEY: 'backoffice',
    MICROSERVICE_GATEWAY_SERVICE_NAME: 'microservice-gateway.example.org',
    FUNCTIONS_FOLDER: __dirname  + '/../functions',
  })

  t.tearDown(async() => {
    await fastify.close()
  })

  const getResponse = (url, body) => {
    return fastify.inject({
      method: 'POST',
      url,
      body,
    })
  }

  t.test('test function is correctly executed', async t => {
    const url = '/hello-world'
    const mockResponse = {
      'text': 'hello-world',
    }
    const res = await getResponse(url, {})

    t.strictSame(res.statusCode, 200)
    t.strictSame(JSON.parse(res.payload), mockResponse)
    t.end()
  })

  t.end()
})
```

### Run the tests (locally)

To run the tests locate the file in the configuration root named ```run-function-service-tests.sh```.

Running this script will execute the tests for each function-service.
You can add an extra argument with the test directory name to run the tests against a single function service (e.g.: _./run-function-service-tests.sh config-map-my-function-service_)

### Run the tests (from Gitlab pipeline)

You can trigger this pipeline from the _CI/CD > Run Pipeline_ Gitlab's menu setting the variable ```RUN_INTEGRATION_TESTS``` to ```TRUE```
