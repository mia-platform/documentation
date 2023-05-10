---
id: jwt_keys
title: Generate JWT Keys
sidebar_label: JWT Keys
---
You can generate a JWT public and private keys using one of the following two utilities:

- `openssl`
- `ssh-keygen`

Use the one you prefer depending on your OS

## Private Key Generation

First of all you have to create a private key in PEM format.

You can use one of the following methods to create it.

### openssl

Use the following command:

```bash
openssl genrsa -out ./private.key 4096
```

### ssh-keygen

Use the following command:

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f private.key
```

Do not add any passphrase.
Moreover this will create in your directory also a `private.key.pub` file that you can delete or ignore.

### Result

You should have in your current directory the `private.key` file containing your private key. **Do not share this file with anyone and keep it secret**. If someone obtained this private key, they would be able to impersonate you!

## Public Key Generation

Now, you have to create one public key from the already generated private key. Use the same tool used in the step before.

### openssl

Use the following command:

```bash
openssl rsa -in private.key -pubout -outform PEM -out public.key
```

### ssh-keygen

Use the following command:

```bash
ssh-keygen -f private.key -e -m PKCS8 > public.key
```

### Result

This will create in your current directory the `public.key` file containing your public key starting from your private key. You can share this file and this will be used by others to identify messages signed using your private key.

## Client Credential Key format

The Client Credential accept the public key in a JWK format. You can you a library or an online tool to generate the needed JWK.
We suggest the following [online tool](https://russelldavies.github.io/jwk-creator/).
Configure it like this:

- Public Key Use: Signing
- Algorithm: RS256
- Key ID: choose yours
- PEM encoded key: your public key (`cat public.key | pbcopy`)

Now you have the JWK necessary to register your client using the private key JWT.
