---
id: events
title: Events
sidebar_label: Events
---



Events follows the `Event` type of [back-kit](/products/microfrontend-composer/back-kit/70_events.md):

```typescript
type Event<P, M> = {
  label: string
  payload: P
  meta?: M
}
```


## ExportForm

The event to open an [ck-export-form](/runtime-components/plugins/care-kit/20_components/20_ck-form-export.md) modal.

- Label: `export-form`

- Payload:

```typescript
{}
```
## TherapyModal

The event to open an [ck-therapy-modal](/runtime-components/plugins/care-kit/20_components/30_ck-therapy-modal.md) modal.

- Label: `therapy-modal`

- Payload:

```typescript
{}
```

## TherapyConfig

Event sent by the the [ck-therapy-select](/runtime-components/plugins/care-kit/20_components/40_ck-therapy-select.md) to configure the contant and behavior of the [ck-therapy-modal](/runtime-components/plugins/care-kit/20_components/30_ck-therapy-modal.md).

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

The event to open an [ck-threshold-modal](/runtime-components/plugins/care-kit/20_components/50_ck-threshold-modal.md) modal.

- Label: `threshold-modal`

- Payload:

```typescript
{}
```

## AddPlanModal

The event to open an [ck-add-plan-modal](/runtime-components/plugins/care-kit/20_components/60_ck-add-plan-modal.md) modal.

- Label: `add-plan-modal`

- Payload:

```typescript
{}
```

## ChartFilters

The event to open contains filters used by the ck-chart component.

- Label: `add-plan-modal`

- Payload:

```typescript
Filters[]
```

## BookSlotModal

The event to open an [ck-book-slot-modal](/runtime-components/plugins/care-kit/20_components/130_ck-book-slot-modal.md) modal.

- Label: `book-slot-modal`

- Payload:

```typescript
{}
```
