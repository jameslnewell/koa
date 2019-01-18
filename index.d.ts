import { IncomingMessage, OutgoingMessage } from "http";

declare module "reload-middleware" {

  export interface Middleware<Request, Response> {
    (req: Request, res: Response, next?: (error: any) => void, error?: any): void;
  }
  
  export interface ReloadMiddlewareOptions {
    verbose?: boolean;
  }
  
  function reloadMiddleware<Request extends IncomingMessage, Response extends OutgoingMessage>(module: string, options?: ReloadMiddlewareOptions): Middleware<Request, Response>;

  export default reloadMiddleware;
  
}
