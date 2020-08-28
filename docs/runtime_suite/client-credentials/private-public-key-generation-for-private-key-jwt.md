# Public Key Generation for Private Key JWT

You can perform this operation using one of the following two utilites:

- `openssl`
- `ssh-keygen`

Use the one you prefer depending on your OS

## Private Key Generation
First of all you have to create a private key in PEM format.

#### openssl
Use the following command:

```
openssl genrsa -out ./private.key 4096
```

#### ssh-keygen
Use the following command:

```
ssh-keygen -t rsa -b 4096 -m PEM -f private.key
```
Do not add any passphrase.
Moreover this will create in your directory also a `private.key.pub` file that you can delete or ignore.

#### Result
You should have in your current directory the `private.key` file containing your private key. **Do not share this file with anyone and keep it secret**. If someone obtained this private key, they would be able to impersonate you!


## Public Key Generation
First of all you have to create a private key in PEM format.

#### openssl
Use the following command:

```
openssl rsa -in private.key -pubout -outform PEM -out public.key
```

#### ssh-keygen
Use the following command:

```
ssh-keygen -f private.key -e -m PKCS8 > public.key
```

#### Result
This will create in your current directory the `public.key` file containing your public key starting from your private key. You can share this file and this will be used by others to identify messages signed using your private key.


## Client Credential Key format

The Client Credential accept the public key in a JWK format. You can you a library or and online tool to generate the needed JWK.
We suggest the following [online tool](https://russelldavies.github.io/jwk-creator/).
Configure it like this:
- Public Key Use: Signing
- Algorithm: RS256
- Key ID: choose yours 
- PEM encoded key: your public key (`cat public.key | pbcopy`)

