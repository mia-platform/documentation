---
id: misc
title: Misc
sidebar_level: Misc
---



## Confirmation Modal

prompts the user for confirmation on certain critical actions

```html
<bk-confirmation-modal></bk-confirmation-modal>
```

![confirmation-modal](../img/components/bk-confirmation-modal.png)

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`rootElementSelectors`|`root-element-selectors`|string| - | - | - |selector to specify where the `confirmationModal` should be appended|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[require-confirm](../events/events.md#require-confirm)|displays a `confirmationModal` with buttons for the user to confirm or cancel the triggering of certain actions| - | - |

### Emits

| event | description |
|-------|-------------|
|`Configurable events`| - |

### Bootstrap

This component does not use bootstrap.

## Microlc Theme Manager

retrieves microlc CSS style variables at runtime

```html
<bk-microlc-theme-manager></bk-microlc-theme-manager>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`rootElementSelectors`|`root-element-selectors`|string| - | - | - |id or key selector of the current plugin root element|

### Listens to

This component listens to no event.

### Emits

This component emits no event.

### Bootstrap

This component does not use bootstrap.

## Notifications

displays toast notifications about events happening on the EventBus according to the maps provided as props

```html
<bk-notifications></bk-notifications>
```

![notifications](../img/components/bk-notifications.png)

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`customEventMap`| - |NotificationsMap| - | - |{}|map containing the labels of any event that should be notified and the related `notificationProps`|
|`duration`|`duration`|number| - | - | - |lingering time for the notification in seconds|
|`errorEventMap`| - |NotificationsMap| - | - |{}|map containing the labels of any event that triggered a `error` that should be notified with the related `notificationProps`|
|`location`| - |"bottomLeft" \\| "bottomRight" \| "topLeft" \| "topRight"| - | - | - |corner location where the notification should be displayed|
|`rootElementSelectors`|`root-element-selectors`|string| - | - | - |selector to specify where the notification should be appended|
|`successEventMap`| - |NotificationsMap| - | - |{}|map containing the labels of any event that triggered a `success` that should be notified with the related `notificationProps`|

- > #### notificationProps
>
> ```json
> {
>   "create-data": {
>      "title": {
>        "en": "Data was created correctly!",
>        "it": "Dato creato correttamente!"
>      },
>      "content": {
>        "en": "The data has been created correctly",
>        "it": "I dati sono stati creati correttamente"
>      },
>      "type": "success"
>   },
>   "update-data": {
>      "title": {
>        "en": "Data was updated correctly!",
>        "it": "Dato aggiornato correttamente!"
>      },
>      "content": {
>        "en": "The data has been updated correctly",
>        "it": "I dati sono stati aggiornati correttamente"
>      },
>      "type": "success"
>   }
> }
> ```
>
> | property | type | values | description |
> |----------|------|--------|-------------|
> | title   | [localizedText](../concepts.md#localization-and-i18n) | any | localized text to be used as notification title |
> | content | [localizedText](../concepts.md#localization-and-i18n) | any | localized text to be used as notification content |
> | type    | string | `success`, `error`, `info`, `warning` | enum of possible notification styling (i.e. icons, color...) |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[success](../events/events.md#success)|displays a notification if the `triggeredBy` field contained in the `meta` of the event has been mapped in the `successEventMap` property| - | - |
|[error](../events/events.md#error)|displays a notification if the `triggeredBy` field contained in the `meta` of the event has been mapped in the `errorEventMap` property| - | - |
|Configurable custom events|displays a notification on any event mapped in the `customEventMap` property| - | - |

### Emits

This component emits no event.

### Bootstrap

This component does not use bootstrap.

## Template

```html
<bk-template></bk-template>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`defaultValue`|`default-value`|string| - | - | - | - |

### Listens to

This component listens to no event.

### Emits

This component emits no event.

### Bootstrap

This component does not use bootstrap.
