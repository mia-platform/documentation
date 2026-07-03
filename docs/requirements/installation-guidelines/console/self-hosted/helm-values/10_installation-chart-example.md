---
id: installation-chart-example
title: Installation Chart Example
sidebar_label: Installation Chart Example
---



```yaml
imageCredentials:
  name: <PULL_SECRET_NAME> # array of image pull secret to pull Console services
  username: <CONTAINER_REGISTRY_USERNAME> # username of the user which download the image from the container registry
  password: <CONTAINER_REGISTRY_PASSWORD> # password of the user which download the image from the container registry
  email: <CONTAINER_REGISTRY_EMAIL> # email of the user which download the image from the container registry

configurations:
  consoleUrl: "<CONSOLE_URL>"
  cmsUrl: "<CONSOLE_CMS_URL>"
  marketplaceSyncFilters: "" # optional: use one or more of this values separated by a comma: template plugin example application sidecar. It is suggested to use at least plugin, to have the plugin automatically updated in marketplace
  repositoryHostname: "<DOCKER_REPOSITORY>" # the docker registry host used for all the docker images in the projects
  keycloak:
    protocol: "<KEYCLOAK_PROTOCOL>" # http or https
    host: "<KEYCLOAK_HOST>" # hostname of the Keycloak instance (without protocol)
    realm: "<KEYCLOAK_REALM>" # realm for Console user authentication
    extensibilityRealm: "<KEYCLOAK_EXTENSIBILITY_REALM>" # realm for extensibility and service-to-service authentication
  redis:
    hosts:
      - "<REDIS_HOST>" # host to connect to redis
  
  mongodbUrl: "<MONGODB_URL>" # url for the mongodb connection for the console
  filesStorageType: "mongodb"
  filesBucketName: "<GRIDFS_COLLECTION_NAME>" # gridFS collection name
  multitinenantNamespace: ""
  miaPlatformDefaultCompanyId: "mia-platform" # the ID of the default Mia-Platform company
  serviceAccountAuthProvider:
    rsaPrivateKeyId: "PRIVATE KEY ID"
    rsaPrivateKeyPass: "PRIVATE KEY PASSPHRASE"
    clientIdSalt: "CLIENT SALT"
    rsaPrivateKeyBase64: |
      "BASE64_PrivateKey"
  servicesImagePullSecrets:
    - "<SERVICE_PULL_SECRET>" # array of image pull secret to pull your custom services
  defaultCoreResources:
    apiGateway:
      memoryLimitMin: "5Mi"
      memoryLimitMax: "25Mi"
    crudService:
      memoryLimitMin: "70Mi"
      memoryLimitMax: "250Mi"
  crudEncryption: # ../../../../runtime-components/plugins/crud-service/30_encryption_configuration.md
    keyVaultNamespace: "<dbname.collectionname>" # set to the collection you wish to use as encryption key vault.
    kmsProvider: "gcp|local" # set to gcp or local based on your desired KMS
    # use this configuration if you want to use locally managed master encryption key
    localConfig:
      masterKey: "<CRUD_ENCRYPTION_KEY>"
    # use this configuration if you want to use the GCP KMS for managing master encryption key
    gcpConfig:
      email: "<KMS_GCP_EMAIL>"
      projectId: "<KMS_GCP_PROJECT_ID>"
      location: "<KMS_GCP_LOCATION>"
      keyRing: "<KMS_GCP_KEY_RING>"
      keyName: "<KMS_GCP_KEY_NAME>"
      privateKey: "<CRUD_ENCRYPTION_KEY>"
  assistant:
    enabled: true
    keys:
      llm: "<YOUR_OPENAI_API_KEY>"
      embeddings: "<YOUR_OPENAI_API_KEY>"
  audit:
    mongodbUrl: "<YOUR MONGODB CONNECTION STRING TO BE USED FOR AUDIT STORAGE>"

apiGateway:
  deploy:
    resources:
      requests:
        cpu: "200m"
        memory: "150Mi"
      limits:
        cpu: "500m"
        memory: "250Mi"

authtoolBff:
  keys:
    privateKey: "<BASE64_PRIVATE_KEY>"
    cookieSecret: "<COOKIE_SECRET>"
    redisTokenEncKey: "<REDIS_TOKEN_ENC_KEY>"
  deploy:
    resources:
      requests:
        cpu: "50m"
        memory: "20Mi"
      limits:
        memory: "100Mi"
        cpu: "200m"

authorizationService:
  deploy:
    resources:
      requests:
        cpu: "50m"
        memory: "20Mi"
      limits:
        memory: "100Mi"
        cpu: "200m"

backendService:
  deploy:
    resources:
      requests:
        memory: "100Mi"
        cpu: "150m"
      limits:
        memory: "700Mi"
        cpu: "400m"
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "500m"

crudService:
  deploy:
    resources:
      requests:
        memory: "200Mi"
        cpu: "200m"
      limits:
        memory: "500Mi"
        cpu: "500m"
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "300m"
      limits:
        memory: "300Mi"
        cpu: "800m"

deployService:
  deploy:
    resources:
      requests:
        memory: "50Mi"
        cpu: "50m"
      limits:
        memory: "250Mi"
        cpu: "150m"
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "400m"

environmentsVariables:
  deploy:
    resources:
      requests:
        memory: "70Mi"
        cpu: "50m"
      limits:
        memory: "150Mi"
        cpu: "150m"
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"

extensibilityManagerService:
  deploy:
    resources:
      requests:
        memory: "100Mi"
        cpu: "150m"
      limits:
        memory: "700Mi"
        cpu: "400m"
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "500m"

favoritesService:
  deploy:
    resources:
      requests:
        memory: "50Mi"
        cpu: "50m"
      limits:
        memory: "250Mi"
        cpu: "150m"

featureToggleService:
  deploy:
    resources:
      requests:
        memory: "50Mi"
        cpu: "50m"
      limits:
        memory: "250Mi"
        cpu: "350m"

filesService:
  deploy:
    resources:
      requests:
        cpu: "100m"
        memory: "120Mi"
      limits:
        cpu: "300m"
        memory: "300Mi"

kubernetesService:
  deploy:
    resources:
      requests:
        memory: "200Mi"
        cpu: "100m"
      limits:
        memory: "600Mi"
        cpu: "400m"
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "350m"

licenseManager:
  deploy:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"

licenseMetricsGenerator:
  cronjob:
    resources:
      requests:
        memory: "200Mi"
        cpu: "100m"
      limits:
        memory: "600Mi"
        cpu: "300m"

mailService:
  deploy:
    resources:
      requests:
        memory: "50Mi"
        cpu: "50m"
      limits:
        memory: "250Mi"
        cpu: "150m"

miaCraftBff:
  deploy:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"

projectService:
  deploy:
    resources:
      requests:
        memory: "50Mi"
        cpu: "50m"
      limits:
        memory: "250Mi"
        cpu: "400m"

rbacManagerBff:
  deploy:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"

rbacStandalone:
  deploy:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"

swaggerAggregator:
  deploy:
    resources:
      requests:
        memory: "50Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "400m"

tenantOverviewBff:
  deploy:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"

websites:
  deploy:
    resources:
      requests:
        cpu: "100m"
        memory: "20Mi"
      limits:
        cpu: "150m"
        memory: "25Mi"

backoffice:
  deploy:
    resources:
      requests:
        memory: "250Mi"
        cpu: "100m"
      limits:
        memory: "250Mi"
        cpu: "250m"
```
