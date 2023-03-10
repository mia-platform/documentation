---
id: application
title: Back-Kit application structure with microlc-element-composer
sidebar_label: Back-Kit application
---

A Back-Kit application that uses a rendering engine such as [microlc-element-composer](https://microlc.io/documentation/docs/micro-lc/core_plugins#microlc-element-composer), is structured into multiple configuration files:

- an `authentication.json` file
- a `configuration.json` file
- a configuration file for each plugin or single page application (SPA). These can be organized in subfolders

This is an example of a typical structure for a Back-Kit application:

```
 - authentication.json
 - configuration.json
 - orders-list.json
 - users
   - riders-list.json
   - customers-list.json
- menu
  - ingredients-list.json
  - dishes-list.json
```

### Authentication

`authentication.json` contains information on the authentication requirements.
For example:

```json
{
  "isAuthNecessary": true,
  "userInfoUrl": "/userinfo",
  "userLogoutUrl": "/logout?redirect=/web-login?redirect=/"
}
```

declares that the user must log in to access the application, and provides endpoints for fetching user information as well as for handling log-outs.

### Configuration

`configuration.json` contains high-level information on the structure of the application.

```json
{
  "theming": {
    "header": {
      "pageTitle": "Back-Kit Application",
      "favicon": "https://url/to/the/icon.png"
    },
    "logo": {
      "alt": "Logo",
      "url_light_image": "https://url/to/the/image.png"
    },
    "variables": {
      "primaryColor": "#087436"
    },
    "menuLocation": "fixedSideBar"
  },
  "shared": {
    "props": {
      "headers": {
        "client-key": ...
      }
    }
  },
  "rightMenu": [
    {
      "entry": "/micro-lc-notification-center/micro-lc-notification-center.esm.js",
      "tag": "micro-lc-notification-center",
      "properties": {
        "clickStrategy": "push",
        "limit": 7,
        "locales": {
          "title": {
            "it": "Notifiche",
            "en": "Notifications"
          },
          "dateFormat": {
            "it": "DD MMM YYYY",
            "en": "MMM DD YYYY"
          },
          "loadingButton": {
            "it": "Carica altro",
            "en": "Load more"
          },
          "errorMessage": {
            "it": "Si ?? verificato un errore, riprovare",
            "en": "An error occurred, try again"
          },
          "noNotification": {
            "it": "Nessuna notifica da visualizzare",
            "en": "No notifications to show"
          },
          "readAll": {
            "it": "Segna tutte come lette",
            "en": "Mark all as read"
          },
          "reload": {
            "it": "Ricarica",
            "en": "Reload"
          },
          "backOnTop": {
            "it": "Torna all'inizio",
            "en": "Back on top"
          }
        }
      }
    }
  ],
  "plugins": [
    {
      "id": "ordersList",
      "label": "Orders",
      "icon": "fas fa-paper-plane",
      "integrationMode": "qiankun",
      "pluginRoute": "/bo-orders-list",
      "pluginUrl": "/element-composer/",
      "props": {
        "configurationName": "orders-list"
      }
    },
    {
      "id": "usersCategory",
      "label": "Users",
      "icon": "fas fa-users",
      "content": [
        {
          "id": "ridersList",
          "label": "Riders",
          "icon": "fas fa-biking",
          "integrationMode": "qiankun",
          "pluginRoute": "/bo-riders-list",
          "pluginUrl": "/element-composer/",
          "props": {
            "configurationName": "riders-list"
          }
        },
        {
          "id": "customersList",
          "label": "Customers",
          "icon": "fas fa-user-tag",
          "integrationMode": "qiankun",
          "pluginRoute": "/bo-customers-list",
          "pluginUrl": "/element-composer/",
          "props": {
            "configurationName": "customers-list"
          }
        }
      ]
    },
    {
      "id": "menuCategory",
      "label": "Menu",
      "icon": "fas fa-book-open",
      "content": [
        {
          "id": "dishesList",
          "label": "Dishes",
          "icon": "fas fa-utensils",
          "integrationMode": "qiankun",
          "pluginRoute": "/bo-dishes-list",
          "pluginUrl": "/element-composer/",
          "props": {
            "configurationName": "dishes-list"
          }
        },
        {
          "id": "ingredientsList",
          "label": "Ingredients",
          "icon": "fas fa-fish",
          "integrationMode": "qiankun",
          "pluginRoute": "/bo-ingredients-list",
          "pluginUrl": "/element-composer/",
          "props": {
            "configurationName": "ingredients-list"
          }
        }
      ]
    }
  ]
}
```

`configuration.json` first includes information about theming:

```json
"theming": {
    "header": {
      "pageTitle": "Back-Kit Application",
      "favicon": "https://url/to/the/icon.png"
    },
    "logo": {
      "alt": "Logo",
      "url_light_image": "https://urs/to/the/image.png"
    },
    "variables": {
      "primaryColor": "#087436"
    },
    "menuLocation": "fixedSideBar"
  }
```

It is possible to specify theme-related information, such as

- a logo, which is visible in the application
- a page title and icon, which appears in the brawser tab
- a primary color, which influences the look of plugins
- positioning of the plugins menu. This is a menu that allows the user to switch plugins

The `shared` section of the file

```json
"shared": {
    "props": {
      "headers": {
        "client-key": ...
      }
    }
  }
```

includes information such as HTTP headers, which may propagate cookies or other settings to manage HTTP calls.

Thirdly, the `rightMenu` section allows to specify the content of a right menu. In the example, a [notification center](https://github.com/micro-lc/micro-lc-notification-center) component is specified.

Finally, `plugins`

```json
"plugins": [
  {
    "id": "ordersList",
    "label": "Orders",
    "icon": "fas fa-paper-plane",
    "integrationMode": "qiankun",
    "pluginRoute": "/bo-orders-list",
    "pluginUrl": "/element-composer/",
    "props": {
      "configurationName": "orders-list"
    }
  },
  {
    "id": "usersCategory",
    "label": "Users",
    "icon": "fas fa-users",
    "content": [
      ...
    ]
  },
  {
    "id": "menuCategory",
    "label": "Menu",
    "icon": "fas fa-book-open",
    "content": [
      ...
    ]
  }
]
```

includes information on the structure of the plugin menu.

- `id` is a unique identifier of the menu option
- `label` and `icon` describe the look of the option in the menu
- `integrationMode` indicates the strategy to use for loading the plugin
- `pluginRoute` is the url of the SPA
- `pluginUrl` is the url of the rendering engine
- `props` includes further information; in particular `configurationName`, which indicates what configuration file to use for resolving the plugin once the option is selected
- plugin menu can also be structure its options into subgroups using a `content` option, which includes an array of plugins

The following image shows the plugin menu resulting from the example:

![Example of plugin menu](img/plugins_menu.png)

### Plugins

Each plugin has its own configuration file, as described in [layout](layout.md).

Following is an image of a Back-Kit application with an empty plugin:

![Example of SPA with an empty plugin](img/no_plugin_spa.png)

The page only includes information specified in the `configuration.json` file, and on the logged-in user.

Once a complete configuration for the plugin is provided, the resulting SPA will be displayed. Selecting a new plugin in the right menu will cause the new plugin to be rendered, without the need for the whole page to load again.

![Example of SPA with web components](img/plugin_spa.png)

For a full example of a plugin configuration, refer to [plugin](plugin.md).