import { Middleware } from "koa";
import { createName } from "./utils/createName";
import * as log from "./utils/log";
import * as m from "./utils/module";
import { Loader, Options } from "../types";

// TODO: reload only when changed - currently it reloads every refresh which is very noisy, particularly for frontend

const createReloadMiddleware = <State = any, Custom = {}>(
  loader: Loader<State, Custom>,
  options: Options = {}
): Middleware<State, Custom> => {
  const { name = createName(), verbose = true } = options;
  const context = { name, verbose };
  let requestCount = 0;

  // log that the wrapped middleware was created
  log.created(context);

  return async (ctx, next) => {
    // clear the require cache
    if (requestCount > 0) {
      m.clearCache();
    }

    // load the wrapped middleware
    const middleware = await m.load(loader, context);

    // increment the count
    ++requestCount;

    // execute the wrapped middleware
    return middleware(ctx, next);
  };
};

export default createReloadMiddleware;
