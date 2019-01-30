import { Middleware } from 'koa';
import { createName } from './utils/createName';
import * as log from './utils/log';
import * as module from './utils/module';
import { ReloadMiddlewareOptions } from './types';

// TODO: reload only when changed - currently it reloads every refresh which is very noisy, particularly for frontend

export default function(loader: () => Promise<any>, options: ReloadMiddlewareOptions = {}): Middleware { 
  const {name = createName(), verbose = true} = options;
  const context = {name, verbose};
  let requestCount = 0;

  // log that the wrapped middleware was created
  log.created(context);

  return async (ctx, next) => {
    
    // clear the require cache
    if (requestCount > 0) {
      module.clearCache(context);
    }

    // load the wrapped middleware
    const middleware = await module.load(loader, context);

    // increment the count
    ++requestCount;

    // execute the wrapped middleware
    return middleware(ctx, next);
  };
}
