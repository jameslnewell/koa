import { Middleware, ParameterizedContext } from "koa";
import * as compose from "koa-compose";
import { Key, RegExpOptions } from "path-to-regexp";
import * as pathToRegExp from "path-to-regexp";

export enum RouteMethod {
  ANY = "*",
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

export interface RouteMatchParams {
  [name: string]: string;
}

export interface RouteMatch {
  pattern: string;
  matched: string;
  parameters: RouteMatchParams;
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function extractParams(match: RegExpMatchArray, keys: Key[]): RouteMatchParams {
  const params: RouteMatchParams = {};
  for (let i = 1; i < match.length; ++i) {
    const key = keys[i - 1];
    const name = key.name;
    const value = match[i];
    params[name] = value;
  }
  return params;
}

export interface RouteOptions extends RegExpOptions {}

export class Route<S = any, C = {}> {
  private _method: RouteMethod;

  private _paths: {
    pattern: string;
    regexp: RegExp;
    keys: Key[];
  }[];

  private _handler: Middleware<S, C>;

  constructor(
    method: RouteMethod,
    path: string | string[],
    middleware: Middleware<S, C> | Middleware<S, C>[],
    options: RouteOptions = {}
  ) {
    const { end = true } = options;
    const paths = toArray(path);
    const middlewares = toArray(middleware);

    if (toArray(paths).length === 0) {
      throw new Error("The route must have at least one path.");
    }
    paths.forEach(path => {
      if (!path.startsWith("/")) {
        throw new Error(`The route path "${path}" must start with a "/".`);
      }
    });

    if (toArray(middlewares).length === 0) {
      throw new Error("The route must have at least one middleware.");
    }

    // store the method
    this._method = method;

    // compile the paths
    this._paths = paths.map(path => {
      const keys: Key[] = [];
      const regexp = pathToRegExp(path, keys, { end });
      return {
        pattern: path,
        regexp,
        keys
      };
    });

    // combine the handlers into a single one
    this._handler = compose(middlewares);
  }

  get method() {
    return this._method;
  }

  get paths() {
    return this._paths.map(path => path.pattern);
  }

  match(method: string, path: string): RouteMatch | undefined {
    // test the method
    if (
      this._method !== RouteMethod.ANY &&
      method.toLowerCase() !== this._method.toLowerCase()
    ) {
      return undefined;
    }

    // test the paths
    for (const compiledPath of this._paths) {
      const match = compiledPath.regexp.exec(path);
      if (match) {
        return {
          pattern: compiledPath.pattern,
          matched: match[0] || "/",
          parameters: extractParams(match, compiledPath.keys)
        };
      }
    }
    return undefined;
  }

  async handle(ctx: ParameterizedContext<S, C>, next: () => Promise<any>) {
    await this._handler(ctx, next);
  }
}
