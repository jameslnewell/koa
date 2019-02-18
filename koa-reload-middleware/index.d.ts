import { Middleware } from "koa";

export interface ReloadMiddlewareOptions {
  name?: string;
  verbose?: boolean;
}

declare function middleware(
  loader: () => Promise<any>,
  options?: ReloadMiddlewareOptions
): Middleware;
export default middleware;
