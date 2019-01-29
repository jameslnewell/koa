

import * as debug from 'debug';
import { Middleware } from 'koa';
import { getLoadedMessage, getErroredMessage, getCreatedMessage } from './utils/messages';

const log = debug('koa-reload-middleware');
let middlewareCount = 0;

// TODO: reload only when changed - currently it reloads every refresh which is very noisy, particularly for frontend

function getDefaultName() {
  return `koa-reload-middleware #${middlewareCount++}`;
}

function clearRequireCache() {
  const appCacheKeys = Object.keys(require.cache).filter(k => !k.includes('node_modules'));
  appCacheKeys.forEach(file => delete require.cache[file]);
  log('require cache cleared', appCacheKeys)
}

export interface Options {
  name?: string;
  verbose?: boolean;
}

export default function(load: () => Promise<any>, options: Options = {}): Middleware { 
  const {name = getDefaultName(), verbose = true} = options;
  let requestCount = 0;

  const messageContext = {name};

  // log that the wrapped middleware was created
  const message = getCreatedMessage(messageContext);
  log(message);

  const importMiddleware = async () => {
    try {
  
      // load the middleware
      const module = await load();
  
      // log the loaded middleware
      const message = getLoadedMessage(messageContext);
      log(message);
  
      // return the middleware
      return module.__esModule ? module.default : module;
  
    } catch (error) {
  
        // log that the wrapped middleware errored while loading
        const message = getErroredMessage(error, messageContext);
        log(message, error);
        if (options.verbose) {
          console.error(`koa-reload-middleware: ${message}`);
          console.error(error);
        }
  
        // throw the error
        throw error;
  
    }
  }

  return async (ctx, next) => {
    
    // clear the require cache
    if (requestCount > 0) {
      clearRequireCache();
    }

    // load the wrapped middleware
    const middleware = await importMiddleware();

    // increment the count
    ++requestCount;

    // execute the wrapped middleware
    return middleware(ctx, next);
  };
}
