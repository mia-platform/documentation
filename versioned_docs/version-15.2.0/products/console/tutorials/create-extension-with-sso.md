---
id: create-extension-with-sso
title: Create Your Extension With Console SSO And Integration Connector Agent
sidebar_label: Create Extensions With Console SSO
---

In this tutorial, we'll see a step-by-step guide on how to create a new extension for the Mia-Platform console using the [Integration Connector Agent](/runtime-components/plugins/integration-connector-agent/10_overview.md) and [Console SSO authentication](/products/console/console-extensibility/sso.md).

While Console SSO authentication is supported for any iFrame-type extension—and thus any technology that allows iFrame creation—this tutorial will focus on integrating a React SPA via an iFrame.

## Prerequisites

To follow this tutorial, you'll need:

1. A Mia-Platform Console project updated to at least **v.14**.
2. A basic understanding of **OAuth authentication** flows.
3. It's recommended to read the official documentation on enabling [Console SSO authentication](/products/console/console-extensibility/sso.md) and configuring and using the [Integration Connector Agent](/runtime-components/plugins/integration-connector-agent/10_overview.md).
4. A **Jira project** with **webhooks** configured.

## Project Structure

With this tutorial, we're going to build an extension to display a list of your Jira tasks directly within the Mia-Platform Console.

To achieve this, we'll need to create and configure the following services:

1. An `API Gateway` to expose our APIs.
2. An `Integration Connector Agent` that will respond to Jira webhooks to collect and save all tickets
created or modified in our Jira project.
3. A `CRUD Service` to save task data.
4. A `React SPA` that will act as the frontend for our extension.
5. [Optional] A `Documentation Aggregator` to interact with the APIs we'll create using the API Portal via the Swagger interface.

## Get The Tickets Data From Jira

The first step is to configure our **Integration Connector Agent** to retrieve data from Jira. To do this, follow these steps:

1. Create an **API Gateway** using the `Envoy API Gateway` plug-in available on the Mia-Platform Marketplace.
2. Next, still using the Marketplace, create the `Integration Connector Agent`.
3. Once the Integration Connector Agent service is created, you'll need to configure the following *environment variables*:
    - `CONFIGURATION_PATH`: with the value `/configs/config.json`
    - `MONGODB_URL`: with your MongoDB connection string
    - `JIRA_CONNECTOR_SECRET`: with the Jira webhook secret you previously created as a prerequisite for this tutorial.
4. In addition to environment variables, the Integration Connector Agent also needs to be configured via a ConfigMap. To do this, in the ConfigMap tab of the service, create a new config.json file with the following content:

```json
{
  "integrations": [
    {
      "source": {
        "type": "jira",
        "authentication": {
          "secret": {
            "fromEnv": "JIRA_CONNECTOR_SECRET"
          }
        }
      },
      "pipelines": [
        {
          "processors": [
            {
              "type": "mapper",
              "outputEvent": {
                "key": "{{ issue.key }}",
                "summary": "{{ issue.fields.summary }}",
                "description": "{{ issue.fields.description }}",
                "createdAt": "{{ issue.fields.created }}",
                "updatedAt": "{{ issue.fields.updated }}",
                "assignee": "{{ issue.fields.assignee.displayName }}",
                "reporter": "{{ issue.fields.reporter.displayName }}",
                "priority": "{{ issue.fields.priority.name }}",
                "status": "{{ issue.fields.status.name }}",
                "__STATE__": "PUBLIC"
              }
            }
          ],
          "sinks": [
            {
              "type": "mongo",
              "url": {
                "fromEnv": "MONGODB_URL"
              },
              "collection": "jira-issues-showcase-mock-project"
            }
          ]
        }
      ]
    }
  ]
}
```

5. Now that the **Integration Connector Agent** is configured, you need to create a `CRUD Service` where the Integration Connector Agent will save the information retrieved from Jira. To do this, create a new microservice directly from the Marketplace using the CRUD Service plugin.
6. Once the CRUD service is created, you'll need to configure the following **environment variables**:
   - `MONGODB_URL`: with your MongoDB connection string.
7. Now that the CRUD Service is configured, you need to create the **collection** where the data will be saved. The collection must have the same name and fields as the Integration Connector Agent's configuration. In our case, the collection name will be `jira-issues-showcase-mock-project`. For the fields, you can use this JSON schema for import:

```json
[
    {
        "name": "_id",
        "type": "ObjectId",
        "required": true,
        "nullable": false,
        "description": "_id"
    },
    {
        "name": "creatorId",
        "type": "string",
        "required": true,
        "nullable": false,
        "description": "creatorId"
    },
    {
        "name": "createdAt",
        "type": "Date",
        "required": true,
        "nullable": false,
        "description": "createdAt"
    },
    {
        "name": "updaterId",
        "type": "string",
        "required": true,
        "nullable": false,
        "description": "updaterId"
    },
    {
        "name": "updatedAt",
        "type": "Date",
        "required": true,
        "nullable": false,
        "description": "updatedAt"
    },
    {
        "name": "__STATE__",
        "type": "string",
        "required": true,
        "nullable": false,
        "description": "__STATE__"
    },
    {
        "name": "_eventId",
        "type": "string",
        "required": true,
        "nullable": false,
        "sensitivityValue": 0,
        "encryptionEnabled": false,
        "encryptionSearchable": false
    },
    {
        "name": "key",
        "type": "string",
        "required": true,
        "nullable": false,
        "sensitivityValue": 0,
        "encryptionEnabled": false,
        "encryptionSearchable": false
    },
    {
        "name": "summary",
        "type": "string",
        "required": true,
        "nullable": false,
        "sensitivityValue": 0,
        "encryptionEnabled": false,
        "encryptionSearchable": false
    },
    {
        "name": "description",
        "type": "string",
        "required": true,
        "nullable": false,
        "sensitivityValue": 0,
        "encryptionEnabled": false,
        "encryptionSearchable": false
    },
    {
        "name": "priority",
        "type": "string",
        "required": true,
        "nullable": false,
        "sensitivityValue": 0,
        "encryptionEnabled": false,
        "encryptionSearchable": false
    },
    {
        "name": "assignee",
        "type": "string",
        "required": true,
        "nullable": false,
        "sensitivityValue": 0,
        "encryptionEnabled": false,
        "encryptionSearchable": false
    },
    {
        "name": "reporter",
        "type": "string",
        "required": true,
        "nullable": false,
        "sensitivityValue": 0,
        "encryptionEnabled": false,
        "encryptionSearchable": false
    },
    {
        "name": "status",
        "type": "string",
        "required": true,
        "nullable": false,
        "sensitivityValue": 0,
        "encryptionEnabled": false,
        "encryptionSearchable": false
    }
]
```

8. The last step is to expose the services we just created. To do this, we need to create the following **endpoints**:
    - `/integration-connector` of type Microservice. This will be the target for the **Jira Webhook**
    - `/jira-issues` of type CRUD

## Create the extension backend

Our extension will need both a **backend** and a **frontend**. In this section, we will see how to create and configure the backend, which will communicate with the CRUD Service to retrieve task data and return it to the frontend, filtering it by the authorized user so that only the tasks of the logged-in user are returned.

To configure the backend, we can start from the `Go 1.22 Template` available on the Marketplace. This tutorial uses Go as the programming language for the backend, but any other language can be chosen.

Once the service is created from the template, we'll need to implement the logic and configure the service according to these steps:

1. Modify the `/config/env.go` file to register the following environment variables.

```go
package config


type EnvironmentVariables struct {
	LogLevel             string `env:"LOG_LEVEL" envDefault:"info"`
	HTTPPort             string `env:"HTTP_PORT" envDefault:"8080"`
	ServicePrefix        string `env:"SERVICE_PREFIX"`
	ServiceVersion       string `env:"SERVICE_VERSION"`
	DelayShutdownSeconds int    `env:"DELAY_SHUTDOWN_SECONDS" envDefault:"10"`

	IdentityProviderTokenURL string `env:"IDENTITY_PROVIDER_TOKEN_URL" envDefault:"<your-console-url>/api/oauth/token"`
	IdentityProviderJWKSURL  string `env:"IDENTITY_PROVIDER_JWKS_URL" envDefault:"<your-console-url>/jwks"`
    CrudTasksUrl sting `env:"CRUD_TASKS_URL" envDefault:"<your-console-url>/v2/jira-issues"`
}
```

2. Create the `UseOauthController` to handle the authentication token in the `/oauth/controller.go` file.

```go
package oauth

 import (
	 "bytes"
	 "io"
	 "net/http"
 
	 "extension-backend/config"
 
	 "github.com/gofiber/fiber/v2"
 )
 
 func UseOauthController(app *fiber.App, envs config.EnvironmentVariables) {
	 app.Post("/token", func(c *fiber.Ctx) error {
		 c.Set("Access-Control-Allow-Origin", "*")
		 c.Set("Access-Control-Allow-Methods", "POST")
		 c.Set("Access-Control-Allow-Headers", "Content-Type,Authorization,User-Agent")
 
		 res, err := http.Post(
			 envs.IdentityProviderTokenURL,
			 "application/json",
			 bytes.NewReader(c.Body()),
		 )
		 if err != nil {
			 c.Send([]byte(err.Error()))
			 return c.SendStatus(http.StatusInternalServerError)
		 }
 
		 defer res.Body.Close()
 
		 resBodyBytes, err := io.ReadAll(res.Body)
		 if err != nil {
			 c.Send([]byte(err.Error()))
			 return c.SendStatus(http.StatusInternalServerError)
		 }
 
		 if res.StatusCode >= http.StatusBadRequest {
			 c.Send(resBodyBytes)
			 return c.SendStatus(res.StatusCode)
		 }
 
		 return c.Send(resBodyBytes)
	 })
 }
```

3. Create the `UseTasksController` that will return the task information to be displayed in the frontend in the `/tasks/controller.go` file.

```go
package tasks

import (
	"context"
	"encoding/json"
	"extension-backend/config"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type Task struct {
	ID          string `json:"_id" bson:"_id"`
	Reporter    string `json:"reporter" bson:"reporter"`
	Status      string `json:"status" bson:"status"`
	Description string `json:"description" bson:"description"`
	Summary     string `json:"summary" bson:"summary"`
	CreatedAt   string `json:"createdAt" bson:"createdAt"`
	UpdatedAt   string `json:"updatedAt" bson:"updatedAt"`
	Assignee    string `json:"assignee,omitempty" bson:"assignee,omitempty"`
	Priority    string `json:"priority" bson:"priority"`
	State       string `json:"__STATE__" bson:"__STATE__"`
	EventID     string `json:"_eventId" bson:"_eventId"`
	Key         string `json:"key" bson:"key"`
}

type UserClaims struct {
	Name string `json:"name"`
}

type CustomClaims struct {
	User UserClaims `json:"user"`
	jwt.RegisteredClaims
}

func UseTasksController(app *fiber.App, envs config.EnvironmentVariables) {
	app.Use("/tasks", func(c *fiber.Ctx) error {
		userName, err := validateAndExtractUserName(c.GetReqHeaders(), envs)
		if err != nil {
			c.Send([]byte(err.Error()))
			return c.SendStatus(http.StatusUnauthorized)
		}
		c.Locals("userName", userName)
		return c.Next()
	})

	app.Get("/tasks", func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET")
		c.Set("Access-Control-Allow-Headers", "Content-Type,Authorization,User-Agent")

		req, err := http.NewRequest("GET", envs.CrudTasksUrl, nil)
		if err != nil {
			return c.SendStatus(http.StatusInternalServerError)
		}

		authHeader := c.Get("Authorization")
		req.Header.Add("Authorization", authHeader)
		req.Header.Add("User-Agent", c.Get("User-Agent"))

		client := &http.Client{}
		res, err := client.Do(req)
		if err != nil {
			return c.SendStatus(http.StatusServiceUnavailable)
		}
		defer res.Body.Close()

		responseBody, err := io.ReadAll(res.Body)
		if err != nil {
			return c.SendStatus(http.StatusInternalServerError)
		}

		if res.StatusCode >= http.StatusBadRequest {
			return c.Status(res.StatusCode).Send(responseBody)
		}

		userName, ok := c.Locals("userName").(string)
		if !ok || userName == "" {
			return c.SendStatus(http.StatusInternalServerError)
		}

		var allTasks []Task
		if err := json.Unmarshal(responseBody, &allTasks); err != nil {
			return c.SendStatus(http.StatusInternalServerError)
		}

		var filteredTasks []Task
		for _, task := range allTasks {
    		if strings.ToLower(task.Assignee) == strings.ToLower(userName) {
        		filteredTasks = append(filteredTasks, task)
    		}
		}

		filteredResponseBody, err := json.Marshal(filteredTasks)
		if err != nil {
			return c.SendStatus(http.StatusInternalServerError)
		}

		c.Set("Content-Type", "application/json")
		return c.Send(filteredResponseBody)
	})
}

func getAccessTokenFromHeader(headers map[string]string) string {
	const bearerScheme = "Bearer "
	const bearerSchemeLen = len(bearerScheme)

	authorizationHeader := headers["Authorization"]
	if len(authorizationHeader) >= bearerSchemeLen {
		bearer := authorizationHeader[:bearerSchemeLen]
		accessToken := authorizationHeader[bearerSchemeLen:]
		if bearer == bearerScheme && accessToken != "" {
			return accessToken
		}
	}

	return ""
}

func validateAndExtractUserName(headers map[string]string, envs config.EnvironmentVariables) (string, error) {
	ctx := context.Background()
	k, err := keyfunc.NewDefaultCtx(ctx, []string{envs.IdentityProviderJWKSURL})
	if err != nil {
		return "", err
	}

	tokenFromRequest := getAccessTokenFromHeader(headers)
	if tokenFromRequest == "" {
		return "", fmt.Errorf("login required")
	}

	token, err := jwt.ParseWithClaims(tokenFromRequest, &CustomClaims{}, k.Keyfunc)
	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		userName := claims.User.Name
		if userName == "" {
			return "", fmt.Errorf("user name not found")
		}
		return userName, nil
	}

	return "", fmt.Errorf("token not valid")
}
```

4. Modify the `/routes.go` file to add the routes you just created.

```go
package main

 import (
	 "context"
	 "fmt"
	 "path"
 
	 "extension-backend/config"
	 "extension-backend/oauth"
	 "extension-backend/tasks"
 
	 swagger "github.com/davidebianchi/gswagger"
	 oasfiber "github.com/davidebianchi/gswagger/support/fiber"
	 "github.com/getkin/kin-openapi/openapi3"
	 "github.com/gofiber/fiber/v2"
	 "github.com/gofiber/fiber/v2/middleware/pprof"
	 glogrus "github.com/mia-platform/glogger/v4/loggers/logrus"
	 middleware "github.com/mia-platform/glogger/v4/middleware/fiber"
	 "github.com/sirupsen/logrus"
 )
 
 func setupRouter(env config.EnvironmentVariables, log *logrus.Logger) (*fiber.App, error) {
	 app := fiber.New()
 
	 middlewareLog := glogrus.GetLogger(logrus.NewEntry(log))
	 app.Use(middleware.RequestMiddlewareLogger[*logrus.Entry](middlewareLog, []string{"/-/"}))
	 StatusRoutes(app, "ext-backend", env.ServiceVersion)
	 if env.ServicePrefix != "" && env.ServicePrefix != "/" {
		 log.WithField("servicePrefix", env.ServicePrefix).Trace("applying service prefix")
		 app.Use(pprof.New(pprof.Config{Prefix: fmt.Sprintf("%s/", path.Clean(env.ServicePrefix))}))
	 }
 
	 oasRouter, err := swagger.NewRouter(oasfiber.NewRouter(app), swagger.Options{
		 Context: context.Background(),
		 Openapi: &openapi3.T{
			 Info: &openapi3.Info{
				 Title:   "extension-backend",
				 Version: env.ServiceVersion,
			 },
		 },
		 JSONDocumentationPath: "/documentations/json",
		 YAMLDocumentationPath: "/documentations/yaml",
		 PathPrefix:            env.ServicePrefix,
	 })
 
	 if err != nil {
		 return nil, err
	 }
 
	 // TODO: add here your routes
	 oauth.UseOauthController(app, env)
	 tasks.UseTasksController(app, env)
 
	 if err = oasRouter.GenerateAndExposeOpenapi(); err != nil {
		 return nil, err
	 }
 
	 return app, nil
 }
```
5. Now that the backend routes have been implemented, you need to configure the following **environment variables** on the service:
    - `IDENTITY_PROVIDER_TOKEN_URL`: with the value `<your-console-url>/api/oauth/token`
    - `IDENTITY_PROVIDER_JWKS_URL`: with the value `<your-console-url>/jwks`
    - `CRUD_TASKS_URL`: with the value `<your-console-url>/v2/jira-issues`
6. The last step is to expose the endpoint for our backend, which the frontend will use. To do this, create an endpoint called `/api` of type **Microservice**.

## Create the extension frontend

Our frontend-service will be the service responsible for exposing the UI for the extension we are going to create. This example starts by using the `Vite TypeScript React 18 Template`. After initializing the service starting from the indicated template, we will need to implement the following components and pages:

- an `AutoLogin` page to handle the automatic login at application startup

- a `Callback` page to handle the token retrieval

- a `Login` page as a fallback in case the autologin doesn't work or needs a retry

- a `Task` Page to show the retrieved tasks from Jira

The authentication flow is explained in greater details in the specific [documentation page](/products/console/console-extensibility/sso.md).
To implement our front-end service follow this step-by-step guide:

1. Initialize the **frontend-service** starting from the `Vite TypeScript React 18 Template` available on the Mia-Platform Marketplace.

2. Modify or create the `src/pages/Home/index.tsx` file as follow:

```ts
import React, {useCallback, useEffect, useMemo} from 'react'
import {FormattedMessage} from 'react-intl'
import {useHistory} from 'react-router-dom'

import logo from './logo.webp'
import './index.css'

function debounce (callback: Function, delay: number): Function {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback()
    }, delay)
  }
}

const Home: React.FC = () => {
  const history = useHistory()

  const enterWebsite = useCallback(() => {
    const sid = localStorage.getItem('sid')
    if (!sid) {
      history.replace('/auto')
      return
    }

    history.replace('/tasks')
  }, [history])

  const debouncedEnterWebsite = useMemo(() => {
    return debounce(enterWebsite, 2000)
  }, [enterWebsite])

  useEffect(() => {
    debouncedEnterWebsite()
  }, [debouncedEnterWebsite])

  return (
    <div className='App'>
      <header className='App-header'>
        <img alt="logo" className='App-logo' src={logo}/>
        
          <FormattedMessage id={'autologin'} />
        
      </header>
    </div>
  )
}

export {
  Home
}
```

This React component functions as a splash or loading screen for an application. It displays a logo and an *autologin* message while initiating a delayed, debounced process to check for an existing user session (sid) in localStorage. Based on this check, it automatically redirects the user to the `/tasks` page if logged in, or to the `/auto` login page if not.

3. Create an `AutoLogin` page in `src/pages/AutoLogin.tsx` path as follow:

```ts
import React, {useCallback, useEffect} from 'react'

import {urls} from '../urls'

const getAuthorizeExtensionPageUrl = (
  tenantId: string,
  extId: string,
  state: string
): string => {
  const url = `${urls.miaPlatformBaseUrl}/oauth/authorize?tenantId=${tenantId}&extensionId=${extId}&state=${state}`
  return url
}


const AutoLogin: React.FC = () => {
  // 1. Lettura delle variabili d'ambiente
  const tenantId = process.env.REACT_APP_TENANT_ID || 'not-set'
  const extId = process.env.REACT_APP_EXTENSION_ID || 'not-set'


  const authorize = useCallback(async () => {
    
    const state = Math.random().toString(36).substring(2, 15)

    localStorage.setItem('auth_state', state)

    window.location.replace(getAuthorizeExtensionPageUrl(tenantId, extId, state))
  }, [tenantId, extId])

  useEffect(() => {
    authorize()
  }, [authorize])

  return (
    <>
      {'Logging in ... please wait ...'}
    </>
  )
}

export {
  AutoLogin
}

```

This React component automates the first step of an *OAuth 2.0* login flow. Upon rendering, it immediately generates a random state value for security, stores it in the browser's local storage, and then redirects the user to a constructed authorization URL, effectively handing off the authentication process to an external service.

4. Create a `Callback.tsx` page in `src/pages/Callback.tsx` as follow:

```ts
import React, {useCallback, useEffect, useMemo} from 'react'
import {useLocation, useHistory} from 'react-router'

import {urls} from '../urls'

function debounce (callback: Function, delay: number): Function {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback()
    }, delay)
  }
}

const Callback: React.FC = () => {
  const location = useLocation()
  const history = useHistory()

  const onLoginSuccess = useCallback(() => {
    const loginFlow = localStorage.getItem('login_flow')

    // Pulizia del localStorage
    localStorage.removeItem('login_flow')
    localStorage.removeItem('auth_state')

    if (loginFlow === 'manual') {
      window.close()
    } else {
      history.replace('/tasks')
    }
  }, [history])

  const requestToken = useCallback(async () => {
    const qs = new URLSearchParams(location.search)
    const authCode = qs.get('code')
    const state = qs.get('state')


    if (!authCode || !state) {
      console.error('❌ [requestToken] Code or State missing in the URL parameters')
      return
    }

    const storedState = localStorage.getItem('auth_state')
    if (storedState !== state) {
      console.error("❌ [requestToken] The state doesn' match")
      return
    }

    try {
      const tokenUrl = process.env.REACT_APP_TOKEN_URL || 'not-set'
      const response = await fetch(
        tokenUrl,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code: authCode, state })
        }
      )

      const responseBody = await response.json()

      if (!response.ok || !responseBody.accessToken) {
        console.error('❌ [requestToken] Server response not valid.', responseBody)
        return
      }

      localStorage.setItem('sid', responseBody.accessToken)
      
      // Chiamata alla funzione di successo
      onLoginSuccess()

    } catch (error) {
      console.error('❌ [requestToken] Critical error fetching the token:', error)
    }
  }, [location.search, onLoginSuccess])

  const debouncedSendRequest = useMemo(() => {
    return debounce(requestToken, 200)
  }, [requestToken])

  useEffect(() => {
    debouncedSendRequest()
  }, [debouncedSendRequest])

  return (
    <>
      {'logging in ...'}
    </>
  )
}

export {
  Callback
}
```

This React component acts as the callback endpoint in an *OAuth 2.0* authentication flow.

Functionally, its purpose is to handle the redirect from an authorization server. It does this by first extracting the code and state parameters from the URL, validating the *state* against the value stored in *localStorage* to prevent CSRF attacks, and then exchanging the authorization code for an access token by making a server-side request. Once the token is successfully retrieved and stored, it finalizes the login by redirecting the user to the main `/tasks` page.

5. Create a `Login.tsx` page in `src/pages/Login.tsx` as follow:

```ts 
import React, {useCallback} from 'react'
import {useHistory} from 'react-router-dom'

import {urls} from '../urls'

const getAuthorizeExtensionPageUrl = (
  tenantId: string,
  extId: string,
  state: string
): string => {
  const url = `${urls.miaPlatformBaseUrl}/oauth/authorize?tenantId=${tenantId}&extensionId=${extId}&state=${state}`
  // Log per mostrare l'URL che viene generato
  return url
}


const Login: React.FC = () => {
  const tenantId = process.env.REACT_APP_TENANT_ID || 'not-set'
  const extId = process.env.REACT_APP_EXTENSION_ID || 'not-set'
  const history = useHistory()


  const onLogin = useCallback(() => {
    const sid = localStorage.getItem('sid')
    
    if (!sid) {
      return
    }

    history.replace('/tasks')
  }, [history])


  const authorize = useCallback(async () => {

    const state = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('auth_state', state)
    
    localStorage.setItem('login_flow', 'manual')

    const popupWindow = window.open(
      getAuthorizeExtensionPageUrl(tenantId, extId, state),
      '*',
      'popup=true,width=400,height=600'
    )

    if (popupWindow) {
      popupWindow.addEventListener('beforeunload', onLogin)
    } else {
      console.error('[authorize] Failing opening the pop-up window')
    }
  }, [tenantId, extId, onLogin])

  return (
    <>
      {'Login here'}
      <button onClick={authorize}>{'Login with Mia-Platform'}</button>
    </>
  )
}

export {
  Login
}
```

This React component provides a manual login option for the user. It displays a *Login* button that, when clicked, initiates an *OAuth authorization flow* by opening a new popup window directed to the authentication service. It sets a "manual" flow flag in local storage and listens for the popup window to close, at which point it checks if a session token has been successfully stored and then redirects the user to the main tasks page.

6. Create a `Tasks.tsx` page in `src/pages/Tasks.tsx` as follow:


```ts
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

const API_BASE_URL = '<your-crud-service-url>'

type TaskModel = {
  _id: string
  key: string
  summary: string
  status: string
  assignee: string | null
  createdAt: string
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

const Tasks: React.FC = () => {
  const history = useHistory()
  const [tasks, setTasks] = useState<TaskModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const logoutCallback = useCallback(() => {
    localStorage.removeItem('sid')
    history.push('/login')
  }, [history])

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)

    const sid = localStorage.getItem('sid')
    if (!sid) {
      setIsLoading(false)
      return
    }

    try {
      const tasksUrl = `${API_BASE_URL}/tasks`
      const auth = `Bearer ${sid.substring(0, 8)}...`

      const res = await fetch(tasksUrl, {
        headers: { Authorization: `Bearer ${sid}` },
      })

      if (!res.ok) {
        console.error(`[fetchTasks] Error fetchin API response: ${res.status} ${res.statusText}`)
        if (res.status === 401 || res.status === 403) {
          logoutCallback()
        }
        return
      }

      const tasksResponse = await res.json() as TaskModel[] | null
      setTasks(tasksResponse || [])
    } catch (err) {
      console.error('[fetchTasks] Critical error:', err)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [logoutCallback])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const tasksTable = useMemo(() => {

    const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' }
    const thStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' }
    const tdStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '12px' }

    return (
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Creation Date</th>
            <th style={thStyle}>Code</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td style={tdStyle}>{formatDate(task.createdAt)}</td>
              <td style={tdStyle}>{task.key}</td>
              <td style={tdStyle}>{task.summary}</td>
              <td style={tdStyle}>{task.status}</td>
              <td style={tdStyle}>{task.assignee || 'Non assegnato'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }, [tasks]) 

  const content = useMemo(() => {
    const sid = localStorage.getItem('sid')
    if (!sid) {
      return (
        <div style={{ padding: '20px' }}>
          {'You must be logged in to view tasks.'}
          <button onClick={() => history.push('/login')}>{'Login'}</button>
        </div>
      )
    }

    const buttonStyle: React.CSSProperties = {
        padding: '10px 15px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
    }

    const disabledButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#cccccc',
        cursor: 'not-allowed',
    }

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>My Tasks</h2>
          <button onClick={logoutCallback} style={buttonStyle}>{'Logout'}</button>
        </div>
        
        {(() => {
          if (isLoading) {
            return <p style={{ margin: '20px 0' }}>Loading tasks...
          }
          if (tasks.length === 0) {
            return <p style={{ margin: '20px 0' }}>No tasks found.
          }

          return tasksTable
        })()}

        <div style={{ marginTop: '20px' }}>
            <button 
                onClick={fetchTasks}
                disabled={isLoading}
                style={isLoading ? disabledButtonStyle : buttonStyle}
            >
                {isLoading ? 'Updating...' : 'Fetch Tasks'}
            </button>
        </div>
      </div>
    )
  
  }, [history, isLoading, tasks.length, tasksTable, logoutCallback, fetchTasks])

  return content
}

export { Tasks }
```

This React component is responsible for displaying a user's tasks from a backend API.

Upon rendering, it checks for a user session token in local storage and, if present, makes an authenticated API call to fetch a list of tasks. The component handles loading and empty states, logs the user out if authentication fails, and presents the retrieved tasks in a formatted table, also providing "Logout" and "Fetch Tasks" buttons for user interaction.

6. Create a `PromiseComponent` in `src/components/utilis/PromiseComponents/index.tsx` as follow:

```ts
import React, {ReactElement, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {MessageFormatElement} from 'react-intl'

type DataType = Record<string, MessageFormatElement[]>

type PromiseComponentProps = {
  promiseFunction: () => Promise<DataType>
  children: (data?: DataType) => ReactElement
}

const PromiseComponent: React.FC<PromiseComponentProps> = ({promiseFunction, children}) => {
  const [data, setData] = useState<DataType>()
  const [isError, setError] = useState<boolean>()

  useEffect(() => {
    promiseFunction()
      .then(response => {
        setData(response)
      })
      .catch(() => {
        setError(true)
      })
  }, [promiseFunction])

  if (data) return children(data)
  if (isError) return <div>{'Error'}</div>
  return <div>{'Loading...'}</div>
}

PromiseComponent.propTypes = {
  children: PropTypes.func.isRequired,
  promiseFunction: PropTypes.func.isRequired
}

export default PromiseComponent

```

This is a generic render prop component designed to manage asynchronous operations.

It accepts a function that returns a promise (promiseFunction) and a child function. It handles the promise's lifecycle by displaying "Loading," "Error," or, upon successful resolution, it calls the children function with the fetched data, allowing the parent component to define how the data is rendered.
This component will be used in the entry point of our service.

7. Update the `App.tsx` as follow:

```ts
import React from 'react'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {join} from 'path'
import dotenv from 'dotenv'

import './App.css'
import {Login} from './pages/Login'
import {Callback} from './pages/Callback'
import {AutoLogin} from './pages/AutoLogin'
import {Tasks} from './pages/Tasks'
import {Home} from './pages/Home'

const LOGIN_PATH = 'login'
const CALLBACK_PATH = 'callback'
const AUTO_LOGIN_PATH = 'auto'
const TASKS_PATH = 'tasks'

dotenv.config()

const App: React.FC = () => {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route component={Home} exact path={match.path} />
      <Route component={Login} exact path={join(match.path, LOGIN_PATH)}/>
      <Route component={Callback} exact path={join(match.path, CALLBACK_PATH)}/>
      <Route component={AutoLogin} exact path={join(match.path, AUTO_LOGIN_PATH)}/>
      <Route component={Tasks} exact path={join(match.path, TASKS_PATH)}/>
      <Redirect to={match.path} />
    </Switch>
  )
}

export default App

```

8. Update the `index.tsx` as follow:

```ts
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {IntlProvider} from 'react-intl'
import {CookiesProvider} from 'react-cookie'

import PromiseComponent from './components/utils/PromiseComponent'
import {store, persistor} from './redux'
import App from './App'
import * as serviceWorker from './serviceWorker'
import messages from './strings'

import './index.css'

const navigatorLanguage = navigator.language.substring(0, 2)
const language = messages[navigatorLanguage] ? navigatorLanguage : 'en'

const rootComponent = (
  <CookiesProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PromiseComponent promiseFunction={messages[language]}>
          {strings => (
            <IntlProvider locale={language} messages={strings}>
              <BrowserRouter basename={process.env.PUBLIC_URL}>
                <App />
              </BrowserRouter>
            </IntlProvider>
          )}
        </PromiseComponent>
      </PersistGate>
    </Provider>
  </CookiesProvider>
)

ReactDOM.render(rootComponent, document.getElementById('root'))

serviceWorker.unregister()
```

9. Now that all the needed changes to our `Vite TypeScript React 18 Template` are implemented we need to add the following environment variables to our service:

- `REACT_APP_TENANT_ID`: with the value `<the-tenant-id-of-your-company>`
- `REACT_APP_EXTENSION_ID`: with the value `<your-extension-id>`
- `REACT_APP_MIA_PLATFORM_BASE_URL`: with the value `<your-console-base-url>`
- `REACT_APP_TOKEN_URL`: with the value `<your-backend-service-url>/api/token`

10.  The last step is to expose the endpoint for our frontend. To do this, create an endpoint called `/` of type **Microservice**.

## Create the extension

Now that our services are up and running we just have to create the **extension**, to do so follow these simple steps:

1. Enter your company page and move to the `Extensions` page under the `Platforge` menu on the left sidebar. Here you can see a list of extension already available.
2. Click the `Add extension menu` in the top right corner of the page and choose the `iframe` option
3. On the `Add iframe extension` modal fill the following fields:
	- **Extension name**: with the value `Jira Extension`
	- **Entry URL**: with the value `<your-frontend-url>`
	- **Destination Area**: with the value `Company Overview`
	- **Category**: with the value `GENERAL`
	- Keep the `Whole Company` flagged
4. Now in the bottom of the extension page you have to click the `Edit` button in the `Console Single-Sign-On` section
5. In the `Console Single-Sign-On` modal you have to flag the `Enable user authentication through Mia-Platform Single-Sign-On` and set the `Callback URL` with the value `<your-frontend-url>/callback`
