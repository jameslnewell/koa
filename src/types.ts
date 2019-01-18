import { IncomingMessage, OutgoingMessage } from "http";

export interface Middleware<Request extends IncomingMessage, Response extends OutgoingMessage> {
  (req: Request, res: Response, next?: (error: any) => void, error?: any): void;
}

export interface ReloadMiddlewareLoader<Request extends IncomingMessage, Response extends OutgoingMessage> {
  default: () => Middleware<Request, Response>;
}

export interface ReloadMiddlewareOptions {
  verbose?: boolean;
}

