import * as path from 'path';
import { IncomingMessage, OutgoingMessage } from "http";
import * as callerPath from 'caller-path';
import { Middleware } from './types';

export default function<Request extends IncomingMessage, Response extends OutgoingMessage>(module: string): Middleware<Request, Response> {
  const middleware = require(require.resolve(module, {paths: [path.dirname(callerPath())]})).default;
  return middleware;
}
