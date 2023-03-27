---
id: events
title: Events
sidebar_label: Events
---
Events follows the `Event` type of backoffice:

```typescript
type Event<P, M> = {
  label: string
  payload: P
  meta?: M
}
```


## ExportForm

The event to open an [ck-export-form](components/ck-form-export.md) modal.

- Label: `export-form`

- Payload:

```typescript
{}
```
## TherapyModal

The event to open an [ck-therapy-modal](components/ck-therapy-modal.md) modal.

- Label: `therapy-modal`

- Payload:

```typescript
{}
```

## TherapyConfig

Event sent by the the [ck-therapy-select](components/ck-therapy-select.md) to configure the contant and behavior of the [ck-therapy-modal](components/ck-therapy-modal.md).

- Label: `therapy-config`

- Payload:

```typescript
{
  planId: string
  planType: string
  prototypeId: string
}
```

## ThresholdModal

The event to open an [ck-threshold-modal](components/ck-threshold-modal.md) modal.

- Label: `threshold-modal`

- Payload:

```typescript
{}
```
