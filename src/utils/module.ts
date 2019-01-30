import * as log from './log';

export function clearCache(options: log.LogOptions) {
  const files = Object.keys(require.cache).filter(k => !k.includes('node_modules'));
  files.forEach(file => delete require.cache[file]);
  log.cleared(files, options);
}

export function load(loader: () => Promise<any>, options: log.LogOptions) {
  return loader().then(
    module => {
      
      // log that the wrapped middleware was loaded
      log.loaded(options);

      // return the middleware
      return  module.default || module;
    },
    error => {

      // log that the wrapped middleware errored while loading
      log.errored(error, options);
  
      // throw the error
      throw error;
    }
  );
}