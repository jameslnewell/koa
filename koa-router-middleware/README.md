# koa-router-middleware

[![CircleCI](https://circleci.com/gh/jameslnewell/koa.svg?style=svg)](https://circleci.com/gh/jameslnewell/koa)
![npm](https://img.shields.io/npm/v/koa-router-middleware.svg)

A router middleware for koa.

## Installation

```
yarn
```

## Usage

`./index.js`

```js
import * as Koa from "koa";
import api from "./routes/api";

new Koa().use("/api", api).listen(() => {
  console.log("server started");
});
```

`./routes/api.js`

```js
import Router from "koa-router-middleware";

export default new Router()
  .use(ctx => {
    ctx.state.user = { name: "James" };
  })
  .get("/cat", ctx => {
    ctx.status = 200;
    ctx.body = [{ type: "bengal" }, { type: "bombay" }];
  })
  .get("/cat/:id", ctx => {
    ctx.status = 200;
    ctx.body = { type: "bengal" };
  })
  .post("/cat", ctx => {
    ctx.status = 201;
    ctx.body = { type: "siamese" };
  })
  .put("/cat/:id", ctx => {
    ctx.status = 200;
    ctx.body = { type: "siamese" };
  })
  .delete("/cat/:id", ctx => {
    ctx.status = 200;
  }).handle;
```
