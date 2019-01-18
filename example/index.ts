import {createServer} from 'http';
import getServerAddress from 'get-server-address';
import reloadMiddleware from 'reload-middleware';

const server = createServer(reloadMiddleware('./route')).listen(8888, () => {
  console.log(`Listening on ${getServerAddress(server)}`);
});
