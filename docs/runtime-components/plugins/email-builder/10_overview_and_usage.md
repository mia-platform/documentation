# Email Builder

## Overview

The Email builder is a Mia-Care plugin that allows the user to create html email templates using the no code tool provided by [Waypoint](https://www.usewaypoint.com/).

## Usage

The email builder plugin exposes a React-based front-end at the `/email-builder` path. The following query parameters are supported:

| Parameter | Required | Description |
|---|---|---|
| `id` | yes | ID of the template being edited |
| `endpoint` | yes | Base path used to load (`GET endpoint/id`) and save (`PATCH endpoint/id`) the template |
| `jsonField` | yes | Name of the property used to store the template in JSON format |
| `htmlField` | yes | Name of the property used to store the template in HTML format |
| `presetsEndpoint` | no | URL of a list endpoint whose items are shown in the left sidebar as starting-point presets. Clicking a preset loads its content into the editor without changing the save target |
| `hideDefaultPresets` | no | Set to `true` to hide the built-in presets (Empty, New appointment, Mia Care) from the left sidebar |
| `lang` | no | UI language. Supported values: `en` (default), `it` |

If neither `presetsEndpoint` is provided nor the default presets are visible, the left sidebar and its toggle button are not rendered.

## How it works

The email builder provides a user interface for creating email templates. This tool converts the graphical elements of the template into both a JSON object and an HTML file.

On opening, the request `GET endpoint/id` is performed to fetch the template. The `jsonField` property of the response is used to load the current JSON version. If `jsonField` is undefined an empty template is loaded instead.

By clicking the Save button the current template is saved remotely via a `PATCH endpoint/id` call with the following body:

```json
{
  "$set": {
    "<jsonField>": "JSON template",
    "<htmlField>": "HTML template"
  }
}
```

If `htmlField` is not passed in the URL the PATCH will fail.

### Preset sidebar

When `presetsEndpoint` is provided, the left sidebar is populated by performing a `GET presetsEndpoint` request. Each item in the response must contain the same `jsonField` property used for the main template. Clicking a preset copies its content into the editor — the save target (`endpoint/id`) is unchanged.

The built-in presets (Empty, New appointment, Mia Care) are always visible unless `hideDefaultPresets=true` is set.

### Internationalisation

The UI language is controlled by the `lang` query parameter. Currently supported locales:

| Value | Language |
|---|---|
| `en` (default) | English |
| `it` | Italian |

All interface labels — toolbar buttons, tooltips, inspector panel fields, error messages, and the preset sidebar — are translated. Content inside the template itself is not affected.

### iframe integration

When the email builder is embedded in an `iframe` and the user clicks Save, a `postMessage` is dispatched to the parent window upon successful save:

```json
{
  "type": "email-template-saved",
  "templateId": "<id>"
}
```

The message is only sent when the email builder is embedded in an iframe. If opened as a standalone page it has no effect. The parent page can listen for it as follows:

```js
window.addEventListener('message', (event) => {
  if (event.data?.type === 'email-template-saved') {
    console.log('Template saved:', event.data.templateId)
  }
})
```
