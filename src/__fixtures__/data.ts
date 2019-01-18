import { IncomingMessage, OutgoingMessage } from "http";

// @ts-ignore
export const request: IncomingMessage = {};
export const response: OutgoingMessage = {
  // @ts-ignore
  send(data: string) {
    console.log('send():', data);
  }
};
