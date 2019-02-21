import { Middleware } from "koa";
import { createName } from "./utils/createName";
import * as m from "./utils/module";
import * as log from "./utils/log";
import { Loader, Options } from "../types";

const createReloadMiddleware = <State = any, Custom = {}>(
  loader: Loader<State, Custom>,
  options: Options = {}
): Middleware<State, Custom> => {
  const { name = createName(), verbose = true } = options;
  const context = { name, verbose };

  // log that the wrapped middleware was created
  log.created(context);

  // start loading the wrapped middleware
  const loading = m.load(loader, context);

  return async (...args) => {
    // wait for the wrapped middleware to load
    const middleware = await loading;

    // execute the wrapped middleware
    return middleware(...args);
  };
};

export default createReloadMiddleware;
