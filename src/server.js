// @flow
import express, { Request, Response } from 'express';
import proxy from 'http-proxy-middleware';
import { createLogger, format, transports} from 'winston';

const V1_URL = 'https://api-dev.homeeondemand.com';
const V2_URL = 'https://api2-dev.homeeondemand.com';

const { combine, timestamp, prettyPrint } = format;
const logger = createLogger({
  level: 'debug',
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.File({ filename: 'logs.log' }),
    new transports.Console()
  ]
});

const app = express();

app.use('/api', proxy('/api', {
  target: V2_URL,
  changeOrigin: true,
  headers: {
    authorization: '4b8b0a0fc59caf2cfe9beb1f9b3fa6e1'
  },
  pathRewrite: {
    '^/api': ''
  },
  router: {
    '/api/v1': V1_URL,
  },
  logLevel: 'debug',
  onProxyRes(proxyRes, req: Request, res: Response) {
    // logger.debug(req.headers);
  },
  onProxyReq(proxyReq, req: Request, res: Response) {
    // logger.debug(req.headers);
  }
}));

app.use('/', (req: Request, res: Response) => res.send('ok'));

const server = app.listen(3000, async () =>
  // eslint-disable-next-line
  console.log('Running at http://localhost:3000'));

export default server;
