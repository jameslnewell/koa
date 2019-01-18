# reload-middleware

[![CircleCI](https://circleci.com/gh/jameslnewell/reload-middleware.svg?style=svg)](https://circleci.com/gh/jameslnewell/reload-middleware)

Reload middleware when it changes.

## Installation

```
yarn
```

## Usage

The following code will output: `Listening at http://[::]:8888`.

```js
import {createServer} from 'http';

createServer(reloadMiddleware('./foobar')).listen();

```

> Will work with `express`, `connect` or any other server that imitates `Server` from the `net` module.