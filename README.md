# consola-loki

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

<!-- [![bundle][bundle-src]][bundle-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

A Loki Reporter for Consola

## Usage

Install package:

```sh
# npm
npm install consola-loki

# yarn
yarn add consola-loki

# pnpm
pnpm install consola-loki

# bun
bun install consola-loki
```

Import:

```js
// ESM
import { LokiReporter } from "consola-loki";

// CommonJS
const { LokiReporter } = require("consola-loki");
```

## Options:

| **Parameter** | **Description**                                   | **Example**                           |
| ------------- | ------------------------------------------------- | ------------------------------------- |
| **`baseURL`** | URL for Grafana Loki                              | `"https://logs-prod-123.grafana.net"` |
| `interval`    | The interval at which batched logs are sent in ms | `5000`                                |
| `labels`      | custom labels, key-value pairs                    | `{ hostname: hostname() }`            |
| `user`        | basic auth user or grafana cloud user             | `123456`                              |
| `password`    | basic auth password or grafana cloud token        | `"glc\_......"`                       |

## Example:

```ts
const consola = createConsola({
  reporters: [
    new LokiReporter({
      baseURL: "your base url here",
      user: "123456",
      password: "glc_......",
      labels: {
        // custom global labels
        hostname: hostname(), // example
      },
    }),
  ],
});
```

## With Nuxt:

Install `consola` and `@nuxt/kit`.

```ts
// modules/loki.ts
import { defineNuxtModule } from "@nuxt/kit";
import { consola } from "consola";
import { LokiReporter, LokiOptions } from "consola-loki";

export default defineNuxtModule<LokiOptions>({
  meta: {
    name: "loki",
  },
  setup(options, nuxt) {
    const loki = new LokiReporter(options);
    consola.addReporter(loki);
  },
});
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // ...
  loki: {
    baseURL: "your base url here",
    user: "123456",
    password: "glc_......",
  },
  //...
});
```

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## Special Thanks

Hugely inspired by [winston-loki](https://github.com/JaniAnttonen/winston-loki)

## License

Made with 💛

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/consola-loki?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/consola-loki
[npm-downloads-src]: https://img.shields.io/npm/dm/consola-loki?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/consola-loki

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/consola-loki/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/consola-loki

[bundle-src]: https://img.shields.io/bundlephobia/minzip/consola-loki?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=consola-loki -->
