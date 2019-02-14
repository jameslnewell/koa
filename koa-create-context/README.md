# koa-create-context

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
