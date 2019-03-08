# Guidelines for logs

Every good program must be interpreted in its entirety to avoid bugs, but **even a 100% coverage is not necessary a "bug free" experience**; this is because software software is available to run in total autonomy without using a system.

To verify this debugging part, every programmer has its own application application logs; but entering the test case, **writing logs without following a logic and / or without discipline can lead to having code not easily analyzed at runtime**.

!!!Information
    This guide means good practices identified within Mia-Platform to write logs that can indicate the flow of execution is finding hitches and possibly the reason.

## Prerequisites
Regarding the application, you must have a prerequisite structure:

1. support at least the ** following log levels **
    * *error*: equal to a log level of 10
    * *warn*: equal to a log level of 20
    * *info*: equal to a log level of 30
    * *debug*: equal to a log level of 40
    * *trace*: equal to a log level of 50
2. support the configuration of the layer via environment variable called **LOG_LEVEL**
3. support writing the **log only on stdout**
4. serialize **each line of logs as json**
5. support enrichment of the log with **additional values​​**
6. write default of the following parameters with the **keys described**:
    * *reqId*: must contain the parameter contained in the X-Request-ID header
    * *time* : must continue timestamp in milliseconds or date encoded in string iso8601 in UTC
    * *level*: must contain in number associated with the log level set in string or number
    * *hostname*: must contain, if possible, the value of the X-Forwarded Host header or the Host header
    * *msg*: an intelligible string of the reason why the log was issued
7. if possible it must provide a way to modify the value of some sensitive keys to avoid logging **sensitive user data** that could transit, the accepted behavior is to have the real value replaced with a string type **[ REDACTED] or [CONFIDENTIAL]**, not to have the key removed from the log

!!! tip
    A nice to have is to have the possibility to pass the log to a program not installed in production to make the "pretty-printing" of the logs during local development, or when accessing the direct stream of the logs on k8s.

##Guidelines

The logs of a program do not necessarily need to be verbose in nature to avoid too much "noise" that could make you lose important but not too "silent" information and get the opposite effect and that is to lose the idea of ​​how the flow of information is proceeding within the program.

> Below we propose general guidelines on what is expected within the various log levels.

## Default log

During development **always keep the logs on at a level equal to at least info**, if at this level in the console you do not read anything or you can not completely rebuild the flow of information within your code, the logs you are writing probably is not enough.

!!! tip
    Always keeping the logs on while developing and testing locally, you also have the possibility to see the logs that the frameworks and libraries you are using are writing by default and therefore avoid unnecessary repetitions.

## Error
At this level, it is assumed to find only error messages related to logical errors encountered during program execution.

!!! warning
    The log is inherent to the error encountered **not to what will eventually be returned to the user**, in fact if it is possible to enrich the log with information regarding why it happened, for example:

```javascript
const expectAlwaysAtLeastOneResult = httpRequest(host, query)
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.error(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    return httpError.serverError()
}

```

In this case not finding results causes an error in the logic of the code because for how the code was structured with the data in the query object it can not be possible not to find at least one result, and therefore it is useful to know where the flow is is stopped and why above all since the answer would be only a standard error page 500. As you can see, no log is used to track the fact that the response returned to the user is an error because in the example we can assume that it is the underlying http framework we are using to do it for us and would therefore be a useless repetition.

## Warn

!!! info
    Although this is one of the most poorly used levels it can sometimes be useful to know that you have taken a path that could highlight a problem avoided as a precaution but that requires our attention.

For example, we can slightly modify the previous example to make it a warning instead of an error:

```javascript

let expectAlwaysAtLeastOneResult = httpRequest(host, query)
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.warn(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    expectAlwaysAtLeastOneResult = recoverADefaultValue()
}

```

In this case, the code is structured to resist any missing data, but we want to make this case clear by logging the fact that the query used to retrieve a value did not return the expected result but we had to use standard values ​​that could degrade the user experience.

## Info

If you follow this guide the info level should be the most used in your code. This is the level that will be passed to your applications when they are run in pre-production and production and that's why it's the key to identifying the flow of your program.

!!! warning
    But do not get carried away by inserting it before and after each function call enter it only in points of attention of your code, where the presence or absence of a log in the console can make you understand that logical choices are being made in your code:

```javascript

const expectAlwaysAtLeastOneResult = httpRequest(host, query)
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.error(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    return httpError.serverError()
}
log.info('expectAlwaysAtLeastOneResult has been retrived')

```
In this example, after the if block, a log was inserted to indicate that the HTTP call to retrieve a mandatory value from a third party service was successful and did not return an error or an incorrect value. In this case we assume that the httpRequest call throws an exception containing the relative HTTP error and that it is handled in another part of the code that can not know exactly which call has failed, to help us understand the extent to which the code arrives leave these clues through info to make us understand that the failed call is not just this; in fact, in the console we will see either the error log or the info log, if neither appears to mean that the code has never arrived at this point in our code.

!!! tip
    However, if the httpRequest function already cares about writing intelligible logs in the console, it is useless to insert this info log. As you can understand info is the most useful level but also the most difficult to use correctly without getting a too verbose log unnecessarily.

## Debug

At the debug level you will be expected to find that information useful during the local test phase or in fact debugging problems encountered while using the application in the test environment; in fact this is the level that will be passed to the various applications when they are launched in that environment.

!!! tip
     A good rule to follow to insert debug logs is if for any reason during development or testing it was necessary to stop and add commands to write in the console parameters passed in our code to understand what was not working. Every time this happens, it's a good time to figure out if it's not better to turn that temporary insertion into a permanent debug log.

In the debug logs we try to insert as much additional information as possible in reference to the log in question, to help us solve the problem encountered.

```javascript

let expectAlwaysAtLeastOneResult = httpRequest(host, query)
log.debug({ originalResults: expectAlwaysAtLeastOneResult }, 'Result returned from HTTP call')
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.warn(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    expectAlwaysAtLeastOneResult = recoverADefaultValue()
}
log.debug({ expectAlwaysAtLeastOneResult }, 'result to use')

```

In this we are trying to understand why the program behaves abnormally so we want to make sure that in this part of the program the correct service is called with the right parameters and that the returned result is what we expect.

## Trace
The trace level is to be used only to enter the "paranoia" mode, when during the debugging of the code you begin to add logs to identify the smallest progress of the information flow or the progress of the changes made to an object or the contrary of to validate that an object is never modified when it is passed within the functions.

```javascript

log.trace({ host, query }, 'Calling third party service')
let expectAlwaysAtLeastOneResult = httpRequest(host, query)
log.trace({ query }, 'Query after the call')
log.debug({ originalResults: expectAlwaysAtLeastOneResult }, 'Result returned from HTTP call')
if (expectAlwaysAtLeastOneResult.length === 0) {
    log.warn(
        { reason: `Query used: ${JSON.stringify(redact(query))}` },
        'Request for resource has returned no value when at least one is expected'
    )
    expectAlwaysAtLeastOneResult = recoverADefaultValue()
}
log.debug({ expectAlwaysAtLeastOneResult }, 'result to use')

```

In this example, two new lines have been added to trace to track the progress of the code and notice how a query object passed to the httpRequest function can be changed by mistake, thus invalidating the call to the third service.

## Conclusion

> Logs for a programmer are an essential tool to be used at their best both in the development phase to identify as soon as possible logic errors that the tests are not identifying (and therefore be able to integrate them accordingly), both during normal use during the various Deploy stages.

It is also useful to keep in mind that the logs of pre-production and production environments are collected and indexed by Elasticsearch, and therefore the additional data that are entered up to the info level is better that they are easily indexable or usable as elements to filter well specific logs.
