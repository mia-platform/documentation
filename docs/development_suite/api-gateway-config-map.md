# Config Map

!!! failure
    DA TESTARE... Work In Progress

It's a map between two values: *A* and *B*. You set the value of *B* based on the value of *A*.

!!! example
    Map a Capital City to his Country.
```
"Rome" "Italy"
"Brussels" "Belgium"
"Copenhagen" "Denmark"
```
And so on.


The first argument can be also a regular expression. To do so you need to prefix the expression with a ~

!!! example
    Map a string to UpperCase or LowerCase

```
"~^[A-Z]+$" "UpperCase"
"~^[a-z]+$" "LowerCase"
```


## How to set restriction to make a request

*maps-groupExpression*

This config map allows you to set the `groupExpression` (permissions required) based on the request received.

Action:

1. Go to Section: api-gateway/maps-groupExpression.map or api-gateway/maps-groupExpression.before.map or api-gateway/maps-groupExpression.after.map
2. Write here your map

The syntax is:

```
$original_request_method-$original_request_uri $group_expression
```

`$original_request_method-$original_request_uri` is a regular expression where \$original_request_method is the HTTP request method, \$original_request_uri is the request uri (only the path, is not included the query string)

The \$group_expression must be a logical expression and will be evaluated  by the Auth Service in order to determine if the sender user owns the required permission

!!! example
    If `/login-site` received a GET request, this request is always considered valid.
```
"~^GET-/login-site" "1";
```


!!! example 
    If it's made a POST request to `/foobar`, it's considered valid only if the Auth Service evaluates as truthy the logical expression `isBackoffice && (groups.admin)`, so that the request comes from the CMS and the user belongs to the admin group or internal group.
```
"~^POST-/foobar" "isBackoffice && (groups.admin || groups.interni))";
```


!!! info
    If no request matches the regular expression is assigned to `group_expression` the value **0**, so the request is rejected.


## How to proxy a request through a service

**Request from the Frontend (port: 8080)**

*maps-proxyName*

This config map allows you to forward your request to a service, based on the sender user and the request done.

Action:

1. Go to Section: api-gateway/maps-proxyName.before.map or api-gateway/maps-proxyName.after.map
2. Write here your map
   
The syntax is:
```
$secret_resolution-$is_allowed-$is_user_logged-$original_request_method-$original_request_uri $proxy_name
```
The variables are:

- `$secret_resolution` : if there is a `secret` associated to the request. Values: *secreted* or *unsecreted*
- `$is_allowed` : *1* if the user has the required permission to access the resource (based on the *groupExpression*), *0* otherwise
- `$is_user_logged` : *1* if the user is logged in. *0* otherwire.
- `$original_request_method` : It's the request method. Values: *GET*, *DELETE*, *POST*, *PATH*, *PUT*
- `$original_request_uri` :  It's the request uri.
- `$proxy_name` : It's the destination service

**Request from the Backoffice (CMS) (port: 8081)**

*maps-proxyBackOfficeName*

Action:

1. Go to Section: api-gateway/maps-proxyBackofficeName.before.map or api-gateway/maps-proxyBackofficeName.after.map
2. Write here your map

The syntax is:
```
$secret_resolution-$is_allowed-$is_user_logged-$request_method-$request_uri $proxy_backoffice_name 
```
The variables are:

- `$secret_resolution` : if there is a `secret` associated to the request. Values: *secreted* or *unsecreted*
- `$is_allowed` : *1* if the user has the required permission to access the resource (based on the *groupExpression*), *0* otherwise
- `$is_user_logged` : *1* if the user is logged in. *0* otherwire.
- `$original_request_method` : It's the request method. Values: *GET*, *DELETE*, *POST*, *PATH*, *PUT*
- `$original_request_uri` :  It's the request uri.
- `$proxy_backoffice_name` : It's the destination service


!!! info "**Info**"
    If no request is matched by any regular expression, the default request is forwarded to "not_found".

!!! example
    I want that if it's done a `GET` request to `/login-site` with or without secret `(secreted|unsecreted)` from an authorized or not authorized user `(0|1)`, logged or not logged `(0|1)`, this request is forwarded to the `demo-login-site` service.

```
"~^(secreted|unsecreted)-(0|1)-(0|1)-GET-/login-site" "demo-login-site";
```

!!! example
    I want that if it's done a `POST` request to `/foo/bar` with an associated secret from a logged user `1` and authorized `1`, it's forwarded to `foo-bar-manager`.

```
"~^secreted-1-1-POST-/foo/bar" "foo-bar-manager";
```


## How to forward a request to another url

**Request from the Frontend (port: 8080)**

*maps-proxyUrl*

It's a map between a request and the destination url.

Action:

1. Go to Section: api-gateway/maps-proxyUrl.before.map or api-gateway/maps-proxyUrl.after.map
2. Write here your map

The syntax is:
```
$request_method-$request_uri $proxy_url
```
The variables are:

- `$request_method` : It's the request method. Values: *GET*, *DELETE*, *POST*, *PATH*, *PUT*
- `$request_uri` : It's the request uri
- `$proxy_url` : It's the url where you want to proxy through

**Request from the Backoffice (CMS) (port: 8081)**

*maps-proxyBackofficeUrl*

The syntax is:
```
$request_method-$request_uri $proxy_backoffice_url 
```

Action:

1. Go to Section: api-gateway/maps-proxyBackofficeUrl.before.map or api-gateway/maps-proxyBackofficeUrl.after.map
2. Write here your map

The variables are:

- `$request_method` : It's the request method. Values: *GET*, *DELETE*, *POST*, *PATH*, *PUT*
- `$request_uri` : It's the request uri
- `$proxy_backoffice_url` : It's the url where you want to proxy through
  
!!! example
    You want to forward all the GET requests /files/images/avatar/foo/ to /user/foo/avatar/
```
"~^GET-/files/images/avatar/(?<username>[\w]+)/$" "/user/$username/avatar/"
```

!!! info
    If no request is matched by any regular expression, the default proxy_url is set to request_uri (the request is forwarded to itself).
