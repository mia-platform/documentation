---
id: gettingstarted
title: Getting Started
sidebar_label: Getting Started
---

With this guide you will:

- Configure and install a Basic configuration of the Helm Chart
- Log-in for the first time to the Console
- Create your first company

## Step 1 - Configuring the Helm Chart

1. Following [this example](../installation-chart/115-Chart%20and%20Helm%20parameters/10-installation-chart-example.md) create a new `values.yaml` file
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

3. Run the script to generate the values of the following variables and edit the value.yaml: `rsaPrivateKeyId`,`rsaPrivateKeyPass`, `clientIdSalt`, `rsaPrivateKeyBase64`, `tokenPassphrase`, `jwtTokenPrivateKeyPassword`, `jwtTokenPrivateKeyBase64`, `masterKey`. These are some of the required [general settings](../installation-chart/115-Chart%20and%20Helm%20parameters/20-general-settings.md) that need to be configured.

```bash
bash scriptname.sh
```

4. Add the remaining [mandatory fields](../installation-chart/115-Chart%20and%20Helm%20parameters/20-general-settings.md) you already prepared [before to start](./10-overview.md)
5. Configure the OAuth provider with the [required info](../installation-chart/115-Chart%20and%20Helm%20parameters/25-authentication-provider.md).
6. Configure the mandatory [MongoDB fields](../installation-chart/115-Chart%20and%20Helm%20parameters/40-mongodb-configurations-and-encryption.md)

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
helm install -f values.yml --create-namespace -n console console mia-platform/mia-console
```

4. Check if the pods are in `ContainerCreating`

```bash
kubectl get pod -n console
```

:::note
When installing an instance of Mia-Platform Console, a user with the Console Super User role will be added to the database automatically.

The Console Super User role has been designed exclusively for backoffice administration purposes.
When assigned to a user, this role implies full visibility and management of all CMS resources.
:::

5. When all your pods are up and running you are ready for the Step 3

## Step 3 - Log-in and Create your first company

1. Reach your console url `https://your-console-url` and you should see the log in page
2. Log-in with your authentication provider
