# koa-reload-middleware

[![CircleCI](https://circleci.com/gh/jameslnewell/koa.svg?style=svg)](https://circleci.com/gh/jameslnewell/koa)

Reload a middleware if is modified during development.

## Installation

```sh
yarn
```

## Usage

```js
import Koa from "koa";
import reload from "koa-reload-middleware";

new Koa().use(reload(() => import("./route"))).listen();
```

> Now change `./route` and the next time that the route is requested, the route will be reloaded without the entire server restarting.
