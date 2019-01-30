import * as debug from 'debug';
import chalk from 'chalk';

const log = debug('koa-reload-middleware');

export interface LogOptions {
  name: string;
  verbose?: boolean;
}

function logAndPrintInfo(message: string, options: LogOptions) {
  log(message);
  if (options.verbose) {
    console.log(message);
  }
}

function logAndPrintError(message: string, options: LogOptions) {
  log(message);
  if (options.verbose) {
    console.error(message);
  }
}

export function created(options: LogOptions) {
  logAndPrintInfo(`created ${chalk.bold(`${options.name}`)}`, options);
}

export function loaded(options: LogOptions) {
  logAndPrintInfo(`loaded ${chalk.bold(`${options.name}`)}`, options);
}

export function errored(error: any, options: LogOptions) {
  if (error && error.code === 'MODULE_NOT_FOUND') {
    logAndPrintError(`failed loading module "${options.name}"`, options); 
  } else {
    logAndPrintError(`failed executing module "${options.name}"`, options);
  }
}

export function cleared(files: string[], options: LogOptions) {
  log(`require cache cleared: %o`, files);
}
