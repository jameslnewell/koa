# koa-create-context

[![CircleCI](https://circleci.com/gh/jameslnewell/koa.svg?style=svg)](https://circleci.com/gh/jameslnewell/koa)

Create a context for mocking or whatever purpose.

## Installation

```
yarn
```

## Usage

```js
import createContext from "koa-create-context";

const context = createContext({
  status: 201,
  body: { data: "Hello World!" }
});
```

## API

### `createContext(options)`

#### Options
