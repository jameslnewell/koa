import {createMockContext} from '@shopify/jest-koa-mocks';
import reload from './index.prod';

describe('koa-reload-middleware.prod', () => {
  const handler = jest.fn();
  const loader = jest.fn();

  beforeEach(() => {
    
    handler.mockReset();
    handler.mockImplementation(() => {});

    loader.mockReset();
    loader.mockImplementation(() => Promise.resolve(handler));

  });

  it('should call the loader once when the middleware is called multiple times', async () => {
    const middleware = reload(loader);
    
    expect(loader).toBeCalledTimes(1);
    expect(handler).toBeCalledTimes(0);

    await middleware(createMockContext(), jest.fn());
    
    expect(loader).toBeCalledTimes(1);
    expect(handler).toBeCalledTimes(1);

    await middleware(createMockContext(), jest.fn());
    
    expect(loader).toBeCalledTimes(1);
    expect(handler).toBeCalledTimes(2);

  });

  it('should reject when the loader errors', async () => {
    loader.mockImplementation(() => Promise.reject(new Error('Uh oh!')));
    const middleware = reload(loader);
    return expect(middleware(createMockContext(), jest.fn())).rejects.toBeInstanceOf(Error);
  });

});
