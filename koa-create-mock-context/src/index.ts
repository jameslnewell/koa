import * as Koa from "koa";
import * as MockReq from "mock-req";
import * as MockRes from "mock-res";

export interface Options {
  req?: any;
  res?: any;
  [name: string]: any;
}

export default function<StateT = any, CustomT = {}>(options: Options = {}) {
  const app = new Koa<StateT, CustomT>();
  const req = new MockReq(options.res || {});
  const res = new MockRes(options.req || {});
  const context = app.createContext(req, res);

  Object.keys(options).forEach(key => {
    if (key !== "req" && key !== "res") {
      context[key] = options[key];
    }
  });

  return context;
}
