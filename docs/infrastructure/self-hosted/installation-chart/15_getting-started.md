---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---



With this guide you will:

- Configure and install a Basic configuration of the Helm Chart
- Log-in for the first time to the Console
- Create your first company

## Required tools

- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/helm/helm_install/)
- [Mongosh](https://www.mongodb.com/docs/mongodb-shell/install/)

## Required information

To install Mia-Platform Console make sure you meet the necessary installation requirements, you can find all the information you may need in the [Self-Hosted installation requirements documentation page](/infrastructure/self-hosted/self-hosted-requirements.md).

Before to start make sure you have addressed the following requirements:

Requirement|Example
--|--
Console and CMS URLs|Console: `https://console.your-domain`<br /> CMS: `https://console-cms.your-domain`
OAuth2 application BaseURL, ClientID, ClientSecret| [Okta example](https://developer.okta.com/docs/guides/find-your-app-credentials/main/) <br />
MongoDB connection string for a user with readWrite permission and dbAdmin permission for console DB| [How to create an Atlas MongoDB cluster](https://www.mongodb.com/docs/guides/atlas/cluster/)<br /> [How to create an Atlas MongoDB user](https://www.mongodb.com/docs/manual/tutorial/create-users/)
Redis host and port|`redis.default.svc.cluster.local:6379`
Private docker registry host and port| `your-repo-hostname:port`
Private docker registry credentials| servicesImagePullSecrets: [MiaSecretName, CustomerSecretName, ...]
Mia-Platform Docker and Helm repo credentials | Ask to your Mia-Platform contact person

## Step 1 - Configuring the Helm Chart

1. Following [this example](/infrastructure/self-hosted/installation-chart/helm-values/10_installation-chart-example.md) create a new `values.yaml` file
2. Create an empty bash file and paste the following code

```bash
rsaPrivateKeyId=$(openssl rand -hex 24)
rsaPrivateKeyPass=$(openssl rand -hex 128)
clientIdSalt=$(openssl rand -hex 256)

ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "$rsaPrivateKeyPass" > /dev/null
rsaPrivateKeyBase64=$(base64 < private.key)
rm private.key private.key.pub

tokenPassphrase=$(openssl rand -hex 128)
jwtTokenPrivateKeyPassword=$(openssl rand -hex 128)
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "$jwtTokenPrivateKeyPassword" > /dev/null
jwtTokenPrivateKeyBase64=$(base64 < private.key)
jwtTokenPrivateKeyKid=$(uuidgen | tr '[:upper:]' '[:lower:]')
rm private.key private.key.pub

masterKey=$(LC_CTYPE=ALL tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 96 | head -1)

echo "rsaPrivateKeyId: $rsaPrivateKeyId"
echo "rsaPrivateKeyPass: $rsaPrivateKeyPass"
echo "clientIdSalt: $clientIdSalt"
echo "rsaPrivateKeyBase64: $rsaPrivateKeyBase64"

echo "tokenPassphrase: $tokenPassphrase"
echo "jwtTokenPrivateKeyPassword: $jwtTokenPrivateKeyPassword"
echo "jwtTokenPrivateKeyBase64: $jwtTokenPrivateKeyBase64"
echo "jwtTokenPrivateKeyKid: $jwtTokenPrivateKeyKid"

echo "masterKey: $masterKey"
```

3. Run the script to generate the values of the following variables and edit the values.yaml file: `rsaPrivateKeyId`,`rsaPrivateKeyPass`, `clientIdSalt`, `rsaPrivateKeyBase64`, `tokenPassphrase`, `jwtTokenPrivateKeyPassword`, `jwtTokenPrivateKeyBase64`, `masterKey`. These are some of the required [general settings](/infrastructure/self-hosted/installation-chart/helm-values/20_general-settings.md) that need to be configured.

```bash
bash scriptname.sh
```

4. Add the remaining [mandatory fields](/infrastructure/self-hosted/installation-chart/helm-values/20_general-settings.md) you already prepared before to start
5. Configure the OAuth provider with the [required info](/infrastructure/self-hosted/installation-chart/helm-values/25_authentication-provider.md)
6. Configure the mandatory [MongoDB fields](/infrastructure/self-hosted/installation-chart/helm-values/40_mongodb-configurations-and-encryption.md)

:::info
More advanced configuration could be managed by following the Helm parameters documentation.
:::

## Step 2 - Installing the Helm Chart

1. Add the Mia-platform repo that contains the helm chart

```bash
helm repo add mia-platform https://nexus.mia-platform.eu/repository/helm-internal/ --username your-username --password-stdin
```

2. Check if you can reach the mia-platform repository

```bash
helm search repo mia-platform
```

3. Launch the installation

```bash
helm install -f values.yml --create-namespace -n console --atomic --timeout 10m console mia-platform/mia-console
```


:::note
The Console Super User role has been designed exclusively for backoffice administration purposes.
When assigned to a user, this role implies full visibility and management of all CMS resources.
:::

4. When all your pods are up and running you are ready for the Step 3

## Step 3 - Log-in and Create your first company

1. Reach your console URL `https://your-console-url` and you should see the log in page
2. Log-in with your authentication provider
3. Create a `role_binding_mongo.yaml` file and a `console-super-user-binding.yaml` with the following configurations
4. Execute the following jobs on the cluster `console` to edit the configuration of the super-user. Remember to substitute the `{{FIRST_LOGIN_EMAIL}}` with your auth provider log-in email

```bash
cat <<EOF | kubectl apply -n console --filename -
apiVersion: batch/v1
kind: Job
metadata:
  name: create-super-user-binding
spec:
  ttlSecondsAfterFinished: 60
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: create-super-user-binding
          image: "mongo"
          imagePullPolicy: IfNotPresent
          command:
          - '/bin/bash'
          - '-c'
          - 'export USER_ID=\$(mongosh \$MONGO_CONNECTION --eval "EJSON.stringify(db.userinfo.findOne({\"email\": \"\$EMAIL\"})._id.toString());" --quiet) && echo \$USER_ID  && mongosh \$MONGO_CONNECTION --eval "EJSON.stringify(db.bindings.updateOne({ \"bindingId\" : \"super-users\"}, { \"\\\$set\": { \"bindingId\": \"super-users\", \"roles\": [\"console-super-user\"], \"subjects\": [ \$USER_ID], \"__STATE__\": \"PUBLIC\" }}, {\"upsert\": true }))"'
          env:
          - name: MONGO_CONNECTION
            valueFrom:
              secretKeyRef:
                name: console
                key: mongo.url.short
          - name: EMAIL
            value: {{FIRST_LOGIN_EMAIL}}
---
apiVersion: batch/v1
kind: Job
metadata:
  name: add-cms-permissions
spec:
  ttlSecondsAfterFinished: 60
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: add-cms-permissions
          image: "mongo"
          imagePullPolicy: IfNotPresent
          command: 
          - '/bin/bash'
          - '-c'
          - 'mongosh \$MONGO_CONNECTION --eval "EJSON.stringify(db.userinfo.updateOne({\"email\": \"\$EMAIL\"}, { \\\$addToSet: { groups: { \\\$each: [ \"console_cms\", \"manage_users\" ] } } }))"'
          env:
          - name: MONGO_CONNECTION
            valueFrom:
              secretKeyRef:
                name: console
                key: mongo.url.short
          - name: EMAIL
            value: {{FIRST_LOGIN_EMAIL}}
EOF
```

:::info
If you want to setup multiple Super User you can use the same binding and add multiple `subjects` to the list directly from backoffice.
:::

5. Now it's possible to can create the first company via API by heading to the `/documentations/api-portal/` path on your Console host and using the `POST /companies` API. The API will return the id of the company.
6. After the creation of the Company you will be able to access it from Console at the `/tenants/:id` path, here you'll be able to manage the Company providers and Clusters.
7.  Now you are ready to start with your first project! You can find out more [here](/console/company-configuration/project-default-configuration.mdx)

:::info
For further information head to the Company creation [documentation section](/console/project-configuration/create-a-project.mdx).
:::
