import * as MockReq from 'mock-req';
import * as MockRes from 'mock-res';
import reloadMiddleware from './index.dev';

describe('reload-middleware', () => {
  const consoleLogSpy = jest.spyOn(global.console, 'log').mockImplementation(() => {});
  const consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    consoleLogSpy.mockReset();
    consoleErrorSpy.mockReset();
  });

  it('should clear the cache and reload the module when called multiple times', () => {
    const middleware = reloadMiddleware('./__fixtures__/okMiddleware');
    middleware(
      new MockReq(), 
      new MockRes()
    );
    middleware(
      new MockReq(), 
      new MockRes()
    );
  });

  it('should call the callback with an error when the file does not exist', (done) => {
    expect.assertions(1);
    const middleware = reloadMiddleware('./__fixtures__/fileDoesNotExist');
    middleware(
      new MockReq(), 
      new MockRes(),
      error => {
        expect(error).toBeDefined();
        done();
      }
    );
  });

  it('should output an error when the file does not exist and verbose=true', (done) => {
    expect.assertions(1);
    const middleware = reloadMiddleware('./__fixtures__/fileDoesNotExist', {verbose: true});
    middleware(
      new MockReq(), 
      new MockRes()
    );
    setTimeout(() => {
      expect(consoleErrorSpy).toBeCalled();
      done();
    }, 100);
  });

  it('should call the callback with an error when the middleware errors', (done) => {
    expect.assertions(1);
    const middleware = reloadMiddleware('./__fixtures__/errMiddleware');
    middleware(
      new MockReq(), 
      new MockRes(),
      error => {
        expect(error).toBeDefined();
        done();
      }
    );
  });

});
