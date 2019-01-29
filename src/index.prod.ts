import { Middleware } from 'koa';

export default function(load: () => Promise<any>): Middleware {
  const promise = load();
  return async (...args) => {
    const module = await promise;
    const middleware = module.__esModule ? module.default : module;
    return middleware(...args);
  };
}
