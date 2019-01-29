import { Middleware } from "koa";


export interface ReloadMiddlewareOptions {
  verbose?: boolean;
}

declare function middleware(load: () => Promise<any>, options?: ReloadMiddlewareOptions): Middleware;
export default middleware;
