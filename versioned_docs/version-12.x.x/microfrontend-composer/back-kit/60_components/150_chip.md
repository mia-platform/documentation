---
id: chip
title: Chip
sidebar_label: Chip
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

<!--
WARNING:
This file is automatically generated. Please edit the 'README' file of the corresponding component and run `yarn copy:docs`
-->


[localized-text]: ../40_core_concepts.md#localization-and-i18n
[table-custom-component]: ./520_table.md#web-component-into-cells
[card-custom-component]: ./140_card.md#mount-web-components-in-card-body



```html
<bk-chip></bk-chip>
```

![bk-chip](img/bk-chip.png)


The Chip is used to display status information inside a badge.
The status information can be mapped to the displayed label and the color-coding of the component.

The most common use of the Chip is to be mounted inside other components, for instance the [Table][table-custom-component] or the [Card][card-custom-component].

## How to configure

For proper functioning of the Chip component, properties `value` and `valueMap` should be specified.
  - `value`:  allows to specify the status value
  - `valueMap`: maps status information to the label and the color-coding of the rendered badge.


Property `valueMap` expects an object that maps possible status information to objects with keys `label` and `color`.
  - `label` supports [internationalized objects][localized-text]
  - `color` should be either `primary` (which corresponds to the primary-color), of any hexadecimal color code

If `valueMap` is not assigned, the rendered badge has primary-color as color-coding and the status information as label.

```json
{
  "tag": "bk-chip",
  "properties": {
    "value": "active",
    "valueMap": {
      "active": {
        "label": "Active",
        "color": "#0f0"
      }
    }
  }
}
```


## Examples

### Example: Chip inside Table

A common use of the Chip is to be mounted inside the [Table][table-custom-component] to render enum properties.

The following configuration renders a Table component with a "status" column which corresponds to an enum field.

```json
{
  "tag": "bk-table",
  "properties": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "enum": ["on", "loading", "off"],
          "visualizationOptions": {
            "tag": "bk-chip",
            "properties": {
              "value": "{{args.[0]}}", // <- `{{args.[0]}}` is value of the table cell
              "valueMap": {
                "on": {
                  "label": "ON",
                  "color": "primary"
                },
                "loading": {
                  "label": "Loading...",
                  "color": "#00f"
                },
                "off": {
                  "label": "OFF",
                  "color": "#f00"
                }
              }
            }
          }
        }
      }
    }
  }
}
```
Each cell of "status" column includes a Chip component having label and color-coding depending on the value of the cell.

## API

### Properties & Attributes

| property   | attribute | type                            | default | description             |
| ---------- | --------- | ------------------------------- | ------- | ----------------------- |
| `value`    | -         | [LocalizedText][localized-text] | -       | status value.           |
| `valueMap` | -         | {[value: string]: any;}         | -       | map of possible values. |

### Listens to

None

### Emits

None