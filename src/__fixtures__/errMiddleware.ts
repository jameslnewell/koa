import {IncomingMessage, OutgoingMessage} from 'http';

export interface Request extends IncomingMessage {
}

export interface Response extends OutgoingMessage {
  send(data: string): void; 
}

export default (req: Request, res: Response, next: (error?: any) => void) => next(new Error('Uh oh!'));