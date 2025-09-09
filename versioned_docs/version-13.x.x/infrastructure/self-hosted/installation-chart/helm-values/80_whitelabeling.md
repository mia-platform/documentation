---
id: whitelabeling
title: Console Website Whitelabeling
sidebar_label: Whitelabeling
---



Some of Mia-Platform logos shown on the frontend can be customized with your own logos and custom images configurations, allowing for a more personalized experience for your users.

## Configuration

The configuration is set under the `staticImages` object, which accepts the following values:

|          Name          |  Type  |                    Description                     | Default | Optional |
| :--------------------: | :----: | :------------------------------------------------: | :-----: | :------: |
|    `loginPageLogo`     | object |          The logo shown on the login page          |         |    ✅     |
| `loginPageBackground`  | object |    The background image shown on the login page    |         |    ✅     |
|       `favicon`        | object |         The favicon of the Console Website         |         |    ✅     |
| `extendedSidebarLogo`  | object | The logo shown on the sidebar when it is extended  |         |    ✅     |
| `collapsedSidebarLogo` | object | The logo shown on the sidebar when it is collapsed |         |    ✅     |

Each of the above values is an object containing these keys:

|      Name       |  Type  |           Description           | Default | Optional |
| :-------------: | :----: | :-----------------------------: | :-----: | :------: |
| `fileExtension` | string | The file extension of the image |         |    ❌    |
| `fileContents`  | string |    The base64 encoded image     |         |    ❌    |


### Examples

```yaml
mia-console:
  staticImages:
    loginPageLogo:
      fileExtension: "png"
      fileContents: <base64>
    favicon:
      fileExtension: "png"
      fileContents: <base64>
```

The base64 encoded image can be generated with a command like:

```sh
cat image.png | base64
```

Then you can paste the output in the `fileContents` field.

### Images specifications

 
#### Image sizes

Given the 1MB limit of the Helm values, **we suggest keeping the images as small as possible**, in the order of a few KBs.
SVG images are preferred, usually smaller than PNG or JPEG images while maintaining good quality.

#### Image format

The images should be in a format that is supported by the browser, such as PNG, JPEG, or SVG.

For each asset type, we suggest the following proportions and sizes:

- `favicon`: a square of at least 16x16 pixels.
- `loginPageLogo`: an image with a reasonable size, the proportions are not strictly defined, but we suggest a minimum size of 200 pixels for each dimension.
- `loginPageBackground`: an image that covers the whole login page background. The [`background-style: cover`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size#cover) CSS property is used, so take into account that it might be cropped when its proportions don't match with the user's screen. In case you need a uniform color background, we suggest to use an SVG image with a single color.
- `extendedSidebarLogo`:   an image with a reasonable size, the proportions are not strictly defined, but we suggest a minimum size of 200 pixels for each dimension. We suggest a rectangular image whose left side perfectly match the `collapsedSidebarLogo` image, so that when expanding and reducing the sidebar the two images are swapped without any visual glitch.
- `collapsedSidebarLogo`:  an image with a reasonable size, the proportions are not strictly defined, but we suggest a minimum size of 200 pixels for each dimension. We suggest a square image that perfectly match the `extendedSidebarLogo` image left side, so that when expanding and reducing the sidebar the two images are swapped without any visual glitch.

None of the above images are required, in case they are not defined the default Mia-Platform images will be used. For this reason, we suggest to define each one of them to have a consistent look and feel of the Console Website with your brand.
