import { Middleware } from "koa";

export interface Options {
  name?: string;
  verbose?: boolean;
}

export type Loader<State, Context> = () => Promise<{
  default: Middleware<State, Context>;
}>;
