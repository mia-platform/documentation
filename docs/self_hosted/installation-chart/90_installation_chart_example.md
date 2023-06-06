---
id: installation_chart_example
title: Installation Chart Example
sidebar_label: Installation Chart Example
---
```yaml
nameOverride: "" # optional
fullnameOverride: "" # optional

mia-console:
  imagePullSecrets:
    - name: <PULL_SECRET_NAME> # array of image pull secret to pull Console services

  configurations:
    consoleUrl: "<CONSOLE_URL>"
    cmsUrl: "<CONSOLE_CMS_URL>"
    marketplaceSyncFilters: "" # optional: use one or more of this values separated by a comma: template plugin example application. It is suggested to use at least plugin, to have the plugin automatically updated in marketplace
    repositoryHostname: "<DOCKER_REPOSITORY>" # the docker registry host used for all the docker images in the projects
    authProviders:
      # this is the placeholder to use if your auth provider is gitlab
      - name: "<AUTH_PROVIDER_ID>" # name of the provider
        type: "gitlab"
        label: "Login" # label of the login button
        baseUrl: "<OAUTH_BASE_URL>" # base url of the gitlab instance
        clientId: "<OAUTH_APP_ID>"
        clientSecret: "<OAUTH_SECRET>"
        authPath: "/oauth/authorize"
        tokenPath: "/oauth/token"
        userInfoPath: "/api/v4/user"
        userSettingsURL: "<BASE_URL>/-/profile" # url to get user settings
        skipRefreshProviderTokenOnMiaTokenRefresh: true # optional: skip the refresh of the provider token when the console one is expired
      # this is the placeholder to use if your auth provider is github
      - name: "<AUTH_PROVIDER_ID>" # name of the provider
        type: "github"
        baseUrl: "<OAUTH_BASE_URL>" # base url of the github instance
        apiBaseUrl: <API_BASE_URL> # api base url
        clientId: "<OAUTH_APP_ID>"
        clientSecret: "<OAUTH_SECRET>"
        cmsClientId: "<CMS_OAUTH_APP_ID>" # The app id with redirect to cms
        cmsClientSecret: "<CMS_OAUTH_SECRET>" # The app secret with redirect to cms
        authPath: "/oauth/authorize"
        tokenPath: "/oauth/token"
        userInfoUrl: "<API_BASE_URL>/user"
        userSettingsURL: "<BASE_URL>/settings/profile" # url to get user settings
        skipRefreshProviderTokenOnMiaTokenRefresh: true # optional: skip the refresh of the provider token when the console one is expired
      # this is the placeholder to use if your auth provider is okta
      - name: "<AUTH_PROVIDER_ID>" # name of the provider
        type: "okta"
        label: "Login" # label of the login button
        baseUrl: "<OAUTH_BASE_URL>" # base url of okta
        clientId: "<OAUTH_APP_ID>"
        clientSecret: "<OAUTH_SECRET>"
        authPath: "/oauth2/v1/authorize"
        tokenPath: "/oauth2/v1/token"
        userInfoPath: "/oauth2/v1/userinfo"
        userSettingsURL: "<BASE_URL>/enduser/settings"
        skipRefreshProviderTokenOnMiaTokenRefresh: true # optional: skip the refresh of the provider token when the console one is expired
      # this is the placeholder to use if your auth provider is github
      - name: "<AUTH_PROVIDER_ID>" # name of the provider
        type: "microsoft"
        baseUrl: "<OAUTH_BASE_URL>" # base url of the github instance
        clientId: "<OAUTH_APP_ID>"
        clientSecret: "<OAUTH_SECRET>"
        authPath: "/authorize"
        tokenPath: "/token"
        userInfoUrl: "https://graph.microsoft.com/oidc/userinfo"
        userSettingsURL: "https://account.microsoft.com/profile/"
        skipRefreshProviderTokenOnMiaTokenRefresh: true # optional: skip the refresh of the provider token when the console one is expired
    redisHost: "<REDIS_HOST>" # optional: default is "redis.default.svc.cluster.local:6379". If installed with this chart, set it to "redis:6379"
    jwtTokenSignKey: "<JWT_TOKEN_SIGN_KEY>" # A JWT signing key, HMAC of 512 bytes
    tokenPassphrase: "<PROVIDER_TOKEN_PASS_PHRASE>" # An HMAC string of 128 bytes for authentication purpose
    mongodbUrl: "<MONGODB_URL>" # url for the mongodb connection for the console
    filesStorageType: "mongodb"
    filesBucketName: "<GRIDFS_COLLECTION_NAME>" # gridFS collection name
    multitinenantNamespace: ""
    customServicesImagePullSecrets:
      - "<SERVICE_PULL_SECRET>" # array of image pull secret to pull your custom services
    defaultCoreResources:
      apiGateway:
        memoryLimitMin: "5Mi"
        memoryLimitMax: "25Mi"
      microserviceGateway:
        memoryLimitMin: "50Mi"
        memoryLimitMax: "300Mi"
      crudService:
        memoryLimitMin: "70Mi"
        memoryLimitMax: "250Mi"
      authorizationService:
        memoryLimitMin: "20Mi"
        memoryLimitMax: "80Mi"
    enableTelemetry: false # set to true if it's possible to collect telemetry for your console usage
    crudEncryption: # ../../runtime_suite/crud-service/encryption_configuration
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
    clusters: # array with the mandatory parameters for the k8s clusters API connections
      - name: "<K8S_CLUSTER_NAME_1>" # example1: K8S_NOPROD
        endpoint: "<K8S_CLUSTER_NAME_ENDPOINT_1>"
        token: "<K8S_CLUSTER_NAME_TOKEN_1>"
      - name: "<K8S_CLUSTER_NAME_2>" # example2: K8S_PRODUCTION
        endpoint: "<K8S_CLUSTER_NAME_ENDPOINT_2>"
        token: "<K8S_CLUSTER_NAME_TOKEN_2>"

  apiGateway:
    deploy:
      resources:
        requests:
          cpu: "200m"
          memory: "150Mi"
        limits:
          cpu: "500m"
          memory: "250Mi"

  rateLimitEnvoy:
    deploy:
      resources:
        requests:
          cpu: "100m"
          memory: "150Mi"
        limits:
          cpu: "300m"
          memory: "200Mi"

  apiPortal:
    deploy:
      resources:
        requests:
          cpu: "10m"
          memory: "5Mi"
        limits:
          cpu: "50m"
          memory: "25Mi"

  authenticationService:
    deploy:
      resources:
        requests:
          cpu: "50m"
          memory: "20Mi"
        limits:
          memory: 100Mi
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

  cmsBackendService:
    deploy:
      resources:
        requests:
          memory: "50Mi"
          cpu: "20m"
        limits:
          memory: "200Mi"
          cpu: "250m"

  cmsSite:
    deploy:
      resources:
        requests:
          cpu: "10m"
          memory: "20Mi"
        limits:
          cpu: "10m"
          memory: "25Mi"

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

  notificationProvider:
    deploy:
      resources:
        requests:
          cpu: "30m"
          memory: "100Mi"
        limits:
          cpu: "100m"
          memory: "200Mi"

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

  v1Adapter:
    deploy:
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
```
