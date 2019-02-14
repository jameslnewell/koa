# koa-create-mock-context

Create a mock context.

## Installation

```
yarn
```

## Usage

```js
import createContext from "koa-create-mock-context";

const context = createContext({
  status: 201,
  body: { data: "Hello World!" }
});
```

## API

### `createContext(options)`

#### Options
