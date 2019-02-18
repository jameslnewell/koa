import * as Koa from "koa";
import * as MockReq from "mock-req";
import * as MockRes from "mock-res";

export type Options<StateT, CustomT> = {
  req?: any;
  res?: any;
  state?: StateT;
  [name: string]: any;
} & Partial<CustomT>;

export default function<StateT = any, CustomT = {}>(
  options: Options<StateT, CustomT> = {}
): Koa.ParameterizedContext<StateT, CustomT> {
  const app = new Koa<StateT, CustomT>();
  const req = new MockReq(options.res || {});
  const res = new MockRes(options.req || {});
  const context = app.createContext<StateT>(req, res);

  Object.keys(options).forEach(key => {
    if (key !== "req" && key !== "res") {
      context[key] = options[key];
    }
  });

  return context as Koa.ParameterizedContext<StateT, CustomT>;
}
