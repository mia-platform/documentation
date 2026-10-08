---
id: filter
title: Filter
sidebar_label: Filter
---



The Filter processor allows you to filter out events based on a condition.
The filtered events will not be sent to the sink.

## Configuration

To configure the Filter processor, you need to define the expression in your configuration file.
It is possible to use this filter in any position of the processor chain,
and if the check fails the pipeline will stop to process.

To configure the Filter processor, you need to provide the following parameters in your configuration file:

- `type` (*string*): The type of the processor, which should be set to `filter`.
- `celExpression` (*string*): The expression to evaluate, following the [cel spec](https://github.com/google/cel-spec).
The expression **MUST** return a boolean value.
If the value is false, the event will be filtered out, otherwise the filter is passed.

### CEL Expression

It is possible to filter events using the CEL expression language.

CEL expression contains 2 different data which is possible to use:

- `eventType` (*string*): the event type taken from the incoming event;
- `data` (*object*): the input event. It is possible to access all the fields using the dot notation.


The following are a set of examples which could be useful to filter events.

#### String equality

In the following example, the filter processor will filter out all events that do not have the `eventType` field set to `my-event-type`.
The `eventType` field is a string, with a value taken from the source event which should define the event type.

```json
{
  "type": "filter",
  "celExpression": "eventType == 'my-event-type'"
}
```

#### Match with a list of event types

In the following example, the filter processor will filter out all events that do not have the `eventType` field set to
`my-event-type` or `another-event-type`.

```json
{
  "type": "filter",
  "celExpression": "eventType in ['my-event-type', 'another-event-type']"
}
```

#### String starts with

In the following example, the filter processor will filter out all events that do not have the
`eventType` field starting with `my`.

```json
{
  "type": "filter",
  "celExpression": "eventType.startsWith('my')"
}
```
#### Data field equality

In the following example, the filter processor will filter out all events which have the `parentId` field different from `my-parent`.

```json
{
  "type": "filter",
  "celExpression": "data.parentId == 'my-parent'"
}
```
