# koa-reload-middleware

[![CircleCI](https://circleci.com/gh/jameslnewell/koa-reload-middleware.svg?style=svg)](https://circleci.com/gh/jameslnewell/koa-reload-middleware)

Reload middleware if it changes during development.

## Installation

```sh
yarn
```

## Usage

The following code will output: `Listening at http://[::]:8080`.

```js
import Koa from 'koa';
import reload from 'koa-reload-middleware';

new Koa().use(reload(() => import('./route'))).listen();
```

> Now you can go and change `./route` and next time the route is requested, the route will automatically reload without restarting the entire server.