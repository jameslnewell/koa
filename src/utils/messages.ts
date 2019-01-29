import chalk from 'chalk';

export interface Context {
  name: string;
}

export function getCreatedMessage(context: Context) {
  return `created ${chalk.bold(`${context.name}`)}`;
}

export function getLoadedMessage(context: Context) {
  return `loaded ${chalk.bold(`${context.name}`)}`;
}

export function getErroredMessage(error: any, context: Context) {
  if (error && error.code === 'MODULE_NOT_FOUND') {
    return `failed loading module "${context.name}"`; 
  } else {
    return `failed executing module "${context.name}"`;
  }
}
