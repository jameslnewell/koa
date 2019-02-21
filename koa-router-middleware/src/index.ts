import * as debug from "debug";
import { Middleware } from "koa";
import { Route, RouteMethod } from "./Route";

const log = debug("koa-router-middleware");

export default class Router<S = any, C = {}> {
  private routes: Route<S, C>[] = [];

  use(...middlewares: Middleware<S, C>[]): Router<S, C>;
  use(
    paths: string | string[],
    ...middlewares: Middleware<S, C>[]
  ): Router<S, C>;
  use(
    pathsOrMiddleware: string | string[] | Middleware<S, C>,
    ...middlewares: Middleware<S, C>[]
  ): Router<S, C> {
    if (typeof pathsOrMiddleware === "string") {
      this.routes.push(
        new Route(RouteMethod.ANY, [pathsOrMiddleware], middlewares, {
          end: false
        })
      );
    } else if (Array.isArray(pathsOrMiddleware)) {
      this.routes.push(
        new Route(RouteMethod.ANY, pathsOrMiddleware, middlewares, {
          end: false
        })
      );
    } else {
      this.routes.push(
        new Route(RouteMethod.ANY, ["/"], [pathsOrMiddleware, ...middlewares], {
          end: false
        })
      );
    }
    return this;
  }

  any(
    paths: string | string[],
    ...middlewares: Middleware<S, C>[]
  ): Router<S, C> {
    this.routes.push(new Route(RouteMethod.ANY, paths, middlewares));
    return this;
  }

  get(
    paths: string | string[],
    ...middlewares: Middleware<S, C>[]
  ): Router<S, C> {
    this.routes.push(new Route(RouteMethod.GET, paths, middlewares));
    return this;
  }

  post(
    paths: string | string[],
    ...middlewares: Middleware<S, C>[]
  ): Router<S, C> {
    this.routes.push(new Route(RouteMethod.POST, paths, middlewares));
    return this;
  }

  put(
    paths: string | string[],
    ...middlewares: Middleware<S, C>[]
  ): Router<S, C> {
    this.routes.push(new Route(RouteMethod.PUT, paths, middlewares));
    return this;
  }

  delete(
    paths: string | string[],
    ...middlewares: Middleware<S, C>[]
  ): Router<S, C> {
    this.routes.push(new Route(RouteMethod.DELETE, paths, middlewares));
    return this;
  }

  handle: Middleware<S, C> = async (ctx, done) => {
    const originalMethod = ctx.method;
    const originalPath = ctx.path;
    const originalParams = ctx.params;

    let index = 0;
    const dispatch = async (): Promise<any> => {
      // check if there are any more routes to try and match
      if (index === this.routes.length) {
        await done();
        return;
      }

      // get the next route
      const route = this.routes[index++];

      // try and match the next route
      const match = route.match(originalMethod, originalPath);
      if (!match) {
        log(
          "route was not matched: request=%o route=%o match=%o",
          {
            method: originalMethod,
            path: originalPath
          },
          {
            method: route.method,
            paths: route.paths
          },
          match
        );
        await dispatch();
        return;
      } else {
        log(
          "route was matched: request=%o route=%o match=%o",
          {
            method: originalMethod,
            path: originalPath
          },
          {
            method: route.method,
            paths: route.paths
          },
          match
        );
      }

      // call the next route
      // TODO: set base path
      // TODO: set original url
      let childPath = originalPath.substr(match.matched.length);
      if (!childPath.startsWith("/")) {
        childPath = `/${childPath}`;
      }
      ctx.path = childPath;
      ctx.basePath = match.matched; // TODO:
      ctx.params = {
        ...originalParams,
        ...match.parameters
      };
      await route.handle(ctx, dispatch);
    };

    await dispatch();
  };
}
