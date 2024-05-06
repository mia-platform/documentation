---
id: enable_auth0
title: How to enable Auth0
sidebar_label: Enable Auth0
---
## How to enable Auth0 as an identity provider in your project

1. Make sure to have the following services between the `enabledServices` of your project:
    * auth0-client
    * oauth-login-site

2. Delete the configuration files of the disabled services;

3. Log into the console, go to the Design Section -> Advanced section and create the `auth0-client` configuration from scratch as an extension. To configure auth0-client, visit [its configuration page](./20_configuration.md). Configure also the env variables (`REDIS_HOSTS` is required).

4. Link correctly client-type and client-key to use the correct auth0 client.

5. Configure auth0 correctly from auth0 dashboard:
    * add rules to inject user metadata in id token:

      ```js
      function (user, context, callback) {
        const namespace = configuration.MIA_NAMESPACE;
        if (!user.app_metadata) {
          console.warn("WARNING: user.app_metadata is empty");
          return callback(null, user, context);
        }
        context.idToken[namespace + 'app_metadata'] = user.app_metadata;
        context.idToken[namespace + 'user_metadata'] = user.user_metadata;
        return callback(null, user, context);
      }
      ```

      MIA_NAMESPACE is a key written as `customClaimsNamespaces` in `auth0 client` configuration. e.g. `https://mia-platform.eu/`

    * configure the management client to handle users through the **headless cms**. The management client is an application machine 2 machine.

    * configure the required client application (remember to properly set allowed callback and logout url)

    * configure the allowed logout url by the tenant settings

6. To handle users through the **headless cms**, add in `cmsProperties.json` file extensions of `cms backend` service:

```json
{
  "users": {
    "id": "users",
    "type": "MIACollection",
    "actions": [],
    "aclExpression": "groups.superadmin",
    "analytics": [],
    "properties": {
      "_id": {
        "id": "_id",
        "type": "string",
        "required": false,
        "label": "_id",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 0,
        "cmsCardPosition": 0,
        "cmsEditable": false,
        "cmsVisibility": {
          "level": 0
        }
      },
      "email": {
        "id": "email",
        "type": "string",
        "required": false,
        "label": "Email",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 10,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 1
        }
      },
      "username": {
        "id": "username",
        "type": "string",
        "required": false,
        "label": "Username",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 20,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 1
        }
      },
      "user_id": {
        "id": "user_id",
        "type": "string",
        "required": false,
        "label": "user identifier",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 0,
        "cmsCardPosition": 0,
        "cmsEditable": false,
        "cmsVisibility": {
          "level": 2
        }
      },
      "created_at": {
        "id": "created_at",
        "type": "string",
        "required": false,
        "label": "Created at",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 70,
        "cmsCardPosition": 0,
        "cmsEditable": false,
        "cmsVisibility": {
          "level": 2,
          "new": {
            "query": {
              "$and": [
                {
                  "created_at": {
                    "$exists": true
                  }
                },
                {
                  "created_at": {
                    "$exists": false
                  }
                }
              ]
            }
          },
          "edit": {
            "query": {
              "$and": [
                {
                  "created_at": {
                    "$exists": true
                  }
                },
                {
                  "created_at": {
                    "$exists": false
                  }
                }
              ]
            }
          }
        }
      },
      "updated_at": {
        "id": "updated_at",
        "type": "string",
        "required": false,
        "label": "Updated at",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 71,
        "cmsCardPosition": 0,
        "cmsEditable": false,
        "cmsVisibility": {
          "level": 2,
          "new": {
            "query": {
              "$and": [
                {
                  "updated_at": {
                    "$exists": true
                  }
                },
                {
                  "updated_at": {
                    "$exists": false
                  }
                }
              ]
            }
          },
          "edit": {
            "query": {
              "$and": [
                {
                  "updated_at": {
                    "$exists": true
                  }
                },
                {
                  "updated_at": {
                    "$exists": false
                  }
                }
              ]
            }
          }
        }
      },
      "identities": {
        "id": "identities",
        "type": "Array_RawObject",
        "required": false,
        "label": "Identities",
        "interfaceType": "rawarray",
        "description": "",
        "cmsOrder": 60,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 2,
          "new": {
            "query": {
              "$and": [
                {
                  "identities": {
                    "$exists": true
                  }
                },
                {
                  "identities": {
                    "$exists": false
                  }
                }
              ]
            }
          }
        }
      },
      "app_metadata": {
        "id": "app_metadata",
        "type": "RawObject",
        "required": false,
        "label": "App metadata",
        "interfaceType": "rawobject",
        "description": "To delete a key in the object, set to null",
        "cmsOrder": 40,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 2
        }
      },
      "user_metadata": {
        "id": "user_metadata",
        "type": "RawObject",
        "required": false,
        "label": "User metadata",
        "interfaceType": "rawobject",
        "description": "To delete a key in the object, set to null",
        "cmsOrder": 41,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 0
        }
      },
      "picture": {
        "id": "picture",
        "type": "string",
        "required": false,
        "label": "Picture",
        "interfaceType": "string",
        "description": "A URL pointing to the picture",
        "cmsOrder": 50,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 2
        }
      },
      "name": {
        "id": "name",
        "type": "string",
        "required": false,
        "label": "Name",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 22,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 1
        }
      },
      "multifactor": {
        "id": "multifactor",
        "type": "Array_string",
        "required": false,
        "label": "Multifactor",
        "interfaceType": "array",
        "description": "",
        "cmsOrder": 66,
        "cmsCardPosition": 0,
        "cmsEditable": false,
        "cmsVisibility": {
          "level": 2,
          "new": {
            "query": {
              "$and": [
                {
                  "multifactor": {
                    "$exists": true
                  }
                },
                {
                  "multifactor": {
                    "$exists": false
                  }
                }
              ]
            }
          },
          "edit": {
            "query": {
              "$and": [
                {
                  "multifactor": {
                    "$exists": true
                  }
                },
                {
                  "multifactor": {
                    "$exists": false
                  }
                }
              ]
            }
          }
        }
      },
      "last_ip": {
        "id": "last_ip",
        "type": "string",
        "required": false,
        "label": "Last IP",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 70,
        "cmsCardPosition": 0,
        "cmsEditable": false,
        "cmsVisibility": {
          "level": 2,
          "new": {
            "query": {
              "$and": [
                {
                  "last_ip": {
                    "$exists": true
                  }
                },
                {
                  "last_ip": {
                    "$exists": false
                  }
                }
              ]
            }
          },
          "edit": {
            "query": {
              "$and": [
                {
                  "last_ip": {
                    "$exists": true
                  }
                },
                {
                  "last_ip": {
                    "$exists": false
                  }
                }
              ]
            }
          }
        }
      },
      "last_login": {
        "id": "last_login",
        "type": "string",
        "required": false,
        "label": "Last login",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 71,
        "cmsCardPosition": 0,
        "cmsEditable": false,
        "cmsVisibility": {
          "level": 2
        }
      },
      "login_count": {
        "id": "login_count",
        "type": "number",
        "required": false,
        "label": "Login count",
        "interfaceType": "number",
        "description": "",
        "cmsOrder": 72,
        "cmsCardPosition": 0,
        "cmsEditable": false,
        "cmsVisibility": {
          "level": 2
        }
      },
      "blocked": {
        "id": "blocked",
        "type": "boolean",
        "required": false,
        "label": "Blocked",
        "interfaceType": "boolean",
        "description": "",
        "cmsOrder": 65,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 2
        }
      },
      "given_name": {
        "id": "given_name",
        "type": "string",
        "required": false,
        "label": "Given name",
        "interfaceType": "string",
        "description": "User first name",
        "cmsOrder": 23,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 2
        }
      },
      "family_name": {
        "id": "family_name",
        "type": "string",
        "required": false,
        "label": "Family name",
        "interfaceType": "string",
        "description": "",
        "cmsOrder": 24,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 2
        }
      },
      "connection": {
        "id": "connection",
        "type": "string",
        "required": false,
        "label": "Connection",
        "interfaceType": "string",
        "description": "Insert here the connection name (this field is required)",
        "cmsOrder": 60,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 3,
          "edit": {
            "query": {
              "$and": [
                {
                  "connection": {
                    "$exists": true
                  }
                },
                {
                  "connection": {
                    "$exists": false
                  }
                }
              ]
            }
          }
        }
      },
      "password": {
        "id": "password",
        "type": "string",
        "required": false,
        "label": "Password",
        "interfaceType": "string",
        "description": "The user initial password, please use strong passwords (must contain numbers, lowercase, uppercase and special characters) and and advice the user to change it once logged in. This field is required!",
        "cmsOrder": 21,
        "cmsCardPosition": 0,
        "cmsEditable": true,
        "cmsVisibility": {
          "level": 3,
          "edit": {
            "query": {
              "$and": [
                {
                  "password": {
                    "$exists": true
                  }
                },
                {
                  "password": {
                    "$exists": false
                  }
                }
              ]
            }
          }
        }
      }
    },
    "cmsProperties": {
      "baseQuery": "",
      "blocked": false,
      "cardType": "",
      "category": {
        "name": "Users",
        "order": 0
      },
      "defDelete": true,
      "defaultStatus": "public",
      "hidden": false,
      "highlight": {},
      "notification": {},
      "icon": "user",
      "label": "users",
      "layoutType": "user-table-v2",
      "dataRefreshDelay": 500,
      "order": 0
    }
  }
}
```
