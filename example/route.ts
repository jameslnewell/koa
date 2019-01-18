import { IncomingMessage, OutgoingMessage } from "http";

export default (req: IncomingMessage, res: OutgoingMessage) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write('👋 Hello World!!!');
  res.end();
};
