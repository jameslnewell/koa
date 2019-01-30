import { Middleware } from 'koa';
import { createName } from './utils/createName';
import * as module from './utils/module';
import * as log from './utils/log';
import { ReloadMiddlewareOptions } from './types';

export default function(loader: () => Promise<any>, options: ReloadMiddlewareOptions = {}): Middleware {
  const {name = createName(), verbose = true} = options;
  const context = {name, verbose};

  // log that the wrapped middleware was created
  log.created(context);
  
  // start loading the wrapped middleware
  const loading = module.load(loader, context);

  return async (...args) => {

    // wait for the wrapped middleware to load
    const middleware = await loading;

    // execute the wrapped middleware
    return middleware(...args);
  };
}
