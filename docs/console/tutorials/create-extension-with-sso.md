---
id: create-extension-with-sso
title: Create Your Extension With Console SSO And Integration Connector Agent
sidebar_label: Create Extensions With Console SSO
---

In this tutorial, we'll see a step-by-step guide on how to create a new extension for the Mia-Platform console using the [Integration Connector Agent](/runtime_suite/integration-connector-agent/10_overview.md) and [Console SSO authentication](/console/console-extensibility/sso.md).

While Console SSO authentication is supported for any iFrame-type extension—and thus any technology that allows iFrame creation—this tutorial will focus on integrating a React SPA via an iFrame.

## Prerequisites

To follow this tutorial, you'll need:

1. A Mia-Platform Console project updated to at least **v.14**.
2. A basic understanding of **OAuth authentication** flows.
3. It's recommended to read the official documentation on enabling [Console SSO authentication](/console/console-extensibility/sso.md) and configuring and using the [Integration Connector Agent](/runtime_suite/integration-connector-agent/10_overview.md).
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
