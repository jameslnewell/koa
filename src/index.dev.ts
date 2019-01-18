
import * as path from 'path';
import {IncomingMessage, OutgoingMessage} from 'http';
import chalk from 'chalk';
import * as debug from 'debug';
import * as callerPath from 'caller-path';

const log = debug('reload-middleware');

// TODO: remove caller-path magic and use () => import(file)
// TODO: reload only when changed - currently it reloads every refresh which is very noisy, particularly for frontend

function getLoadedMessage(module: string) {
  return `loaded ${chalk.bold(`./${path.relative('.', module)}`)}`;
}

function getErroredMessage(module: string, error?: any) {
  if (error && error.code === 'MODULE_NOT_FOUND') {
    return `failed loading module "${module}"`; 
  } else {
    return `failed executing module "${module}"`;
  }
}

function clearRequireCache() {
  const appCacheKeys = Object.keys(require.cache).filter(k => !k.includes('node_modules'));
  appCacheKeys.forEach(file => delete require.cache[file]);
  log('cleared the require cache', appCacheKeys)
}

function requireMiddleware(module: string, options: Options) {
  try {

    // load the middleware
    const middleware = require(require.resolve(module, {paths: [path.dirname(callerPath())]}));
    console.log(middleware)

    // log the loaded module
    const message = getLoadedMessage(module);
    log(message);
    if (options.verbose) {
      console.log(message);
    }

    // return the middleware
    return middleware.default;

  } catch (error) {

      // log the error
      const message = getErroredMessage(module, error);
      log(message, error);
      if (options.verbose) {
        console.error(`reload-module: ${message}`);
        console.error(error);
      }

      // throw the error
      throw error;

  }
}

export interface Options {
  verbose?: boolean;
}

export default function<Request extends IncomingMessage, Response extends OutgoingMessage>(module: string, options: Options = {verbose: true}) {  
  return (req: Request, res: Response, next?: (error: any) => void, error?: any) => {
    
    // clear the require cache
    clearRequireCache();

    // load the wrapped middleware
    let middleware;
    try {
      middleware = requireMiddleware(module, options);
    } catch (error) {
      if (next) {
        next(error);
      }
      return;
    }

    // execute the wrapped middleware
    middleware(req, res, next, error);
    
  };
}
