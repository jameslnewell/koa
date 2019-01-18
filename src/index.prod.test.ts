import reloadMiddleware from './index.prod';
import okMiddleware from './__fixtures__/okMiddleware';

describe('reload-middleware.prod', () => {

  it('should return the middleware', () => {
    const middleware = reloadMiddleware('./__fixtures__/okMiddleware');
    expect(middleware).toBe(okMiddleware);
  });

});
