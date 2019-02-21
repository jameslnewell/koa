import { Middleware } from "koa";
import { Loader, Options } from "./types";

declare function createReloadMiddleware<State = any, Context = {}>(
  loader: Loader<State, Context>,
  options?: Options
): Middleware<State, Context>;

export default createReloadMiddleware;
