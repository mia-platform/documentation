---
id: bundling
title: Bundling your webcomponents with vite
sidebar_label: Bundling
sidebar_position: 30
---

The aim of this section is to highlight some features we found useful to bundle webcomponents together.

Let's say we have a bunch of webcomponents such as

```text
├── my-button
|   └── index.js
|   └── manifest.js
|
├── my-table
|   └── index.js
|   └── manifest.js
|
├── index.js
├── my-components.js
|
```

The most important thing to remember is that webcomponent definitions must appear once and they must not repeat themself even accidentally (the bundler might mess up with the tree of dependencies).

Another point of attention must be the desired output: whether the library will be consumed by browsers only or could be made available to Node.js environments as development resource, say by publishing an npm library.

In the latter case you might consider having a library entrypoint `my-components.js` and an npm package entrypoint `index.js`

The components might look like

```javascript
// my-button/index.js

export default class MyButton extends HTMLElement {
  static get __manifest() {
    return import('./manifest').then(({default: manifest}) => manifest)
  }

  /**
   * properties and lifecycle
   */
}
```

the browser entrypoint could be:

```javascript
// my-components.js
import MyButton from './my-button'
import MyTable from './my-table'

window.customElements.define('my-button', MyButton)
window.customElements.define('my-table', MyTable)
```

and the npm `index.js` would look like:

```javascript
import MyButton from './my-button'
import MyTable from './my-table'

export {
  MyButton,
  MyTable,
}
```

the `vite` configuration would produce the browser bundle being:

```typescript
// vite.config.ts
import {defineConfig} from 'vite'

export default defineConfig({
  // rest of the configuration
  build: {
    // rest of build configuration
    rollupOptions: {
      input: {
        'my-components': '/path/to/my-components.js'
      }
    }
  }
})
```

the `npm` bundle can be instead obtained using tools like `esbuild` or `tsc`.

Bundling components separately is another strategy:

```typescript
// vite.config.ts
import {defineConfig} from 'vite'

export default defineConfig({
  // rest of the configuration
  build: {
    // rest of build configuration
    rollupOptions: {
      input: {
        'my-button': '/path/to/my-button/index.js'
        'my-table': '/path/to/my-table/index.js'
      }
    }
  }
})
```

Be aware that runtime loading of webcomponents is a key factor here. The browser `window` won't be able to follow dynamic imports in order to wait page `onload` event, which means that loading multiple webcomponents from different bundles might make them appear at different times. A consistent visualization is instead guaranteed when the components are loaded together, at least to a further degree.

This remark does not rule out separate bundles. For instance `micro-lc` is bundled separately with respect to its loading webcomponent, which by default shows spinning hexagons until `micro-lc` fires an `onload` event. `mlc-loading-animation` loads first and is safe to assume won't need `micro-lc` to be loaded to start its work.

A components library providing buttons, tables, forms, is definitively an example of a set of webcomponents which must be bundled together:

1. they load together avoiding weird flashes
2. they reuse chunks of code like stylesheets
