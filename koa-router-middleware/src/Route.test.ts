import { Route, RouteMethod, RouteMatch } from "./Route";

describe("Route", () => {
  describe(".constructor()", () => {
    it("should throw when there are no paths", () => {
      expect(() => new Route(RouteMethod.POST, [], [])).toThrow(
        "The route must have at least one path."
      );
    });
    it("should throw when the a path does not start with /", () => {
      expect(() => new Route(RouteMethod.POST, ["/foo", "bar"], [])).toThrow(
        'The route path "bar" must start with a "/".'
      );
    });
    it("should throw when there are no middlewares", () => {
      expect(() => new Route(RouteMethod.POST, ["/foo/bar"], [])).toThrow(
        "The route must have at least one middleware."
      );
    });
  });

  describe(".match()", () => {
    const matchedRequests: [RouteMethod, string, Route, RouteMatch][] = [
      // match any method and every path
      [
        RouteMethod.ANY,
        "/",
        new Route(RouteMethod.ANY, "/", jest.fn()),
        {
          pattern: "/",
          matched: "/",
          parameters: {}
        }
      ],
      // match a method and any path
      [
        RouteMethod.PUT,
        "/",
        new Route(RouteMethod.PUT, "/", jest.fn()),
        {
          pattern: "/",
          matched: "/",
          parameters: {}
        }
      ],
      // match any method and a path
      [
        RouteMethod.PUT,
        "/api",
        new Route(RouteMethod.ANY, "/api", jest.fn()),
        {
          pattern: "/api",
          matched: "/api",
          parameters: {}
        }
      ],
      // match a method and a path
      [
        RouteMethod.DELETE,
        "/api/user",
        new Route(RouteMethod.DELETE, "/api/user", jest.fn()),
        {
          pattern: "/api/user",
          matched: "/api/user",
          parameters: {}
        }
      ],
      // match a method and one of multiple paths
      [
        RouteMethod.DELETE,
        "/api/user",
        new Route(RouteMethod.DELETE, ["/api/person", "/api/user"], jest.fn()),
        {
          pattern: "/api/user",
          matched: "/api/user",
          parameters: {}
        }
      ],
      // match a method and a path when the path contains a parameter
      [
        RouteMethod.DELETE,
        "/api/user/abc-123",
        new Route(RouteMethod.DELETE, "/api/user/:id", jest.fn(), {
          end: false
        }),
        {
          pattern: "/api/user/:id",
          matched: "/api/user/abc-123",
          parameters: { id: "abc-123" }
        }
      ],
      // match a method and a path when the path is longer
      [
        RouteMethod.POST,
        "/api/user",
        new Route(RouteMethod.POST, "/api", jest.fn(), { end: false }),
        {
          pattern: "/api",
          matched: "/api",
          parameters: {}
        }
      ]
    ];

    const unmatchedRequests: [RouteMethod, string, Route][] = [
      // incorrect method
      [
        RouteMethod.POST,
        "/foo/bar",
        new Route(RouteMethod.PUT, "/foo/bar", jest.fn())
      ],

      // incorrect path
      [
        RouteMethod.POST,
        "/foo/bar",
        new Route(RouteMethod.POST, "/bar/foo", jest.fn())
      ],

      // incorrect paths
      [
        RouteMethod.POST,
        "/foo/bar",
        new Route(RouteMethod.POST, ["/bar/1", "/bar/2"], jest.fn())
      ],

      // longer path
      [
        RouteMethod.GET,
        "/foo/bar",
        new Route(RouteMethod.GET, "/foo", jest.fn())
      ]
    ];

    matchedRequests.forEach(([method, path, route, result], index) => {
      it(`should return a match #${index}`, () => {
        expect(route.match(method, path)).toEqual(result);
      });
    });

    unmatchedRequests.forEach(([method, path, route], index) => {
      it(`should not return a match #${index}`, () => {
        expect(route.match(method, path)).toBeUndefined();
      });
    });
  });

  describe(".handle()", () => {
    it("should call the middleware and then next", async () => {
      const ctx = {};
      const next = jest.fn();
      const middleware = jest.fn((_, next) => next());
      const route = new Route(RouteMethod.GET, "/foo", middleware);
      await route.handle(ctx, next);
      expect(middleware).toBeCalledWith(ctx, expect.any(Function));
      expect(next).toBeCalledTimes(1);
    });
    it("should call the middlewares and then next", async () => {
      const ctx = {};
      const next = jest.fn();
      const middleware1 = jest.fn((_, next) => next());
      const middleware2 = jest.fn((_, next) => next());
      const route = new Route(RouteMethod.GET, "/foo", [
        middleware1,
        middleware2
      ]);
      await route.handle(ctx, next);
      expect(middleware1).toBeCalledWith(ctx, expect.any(Function));
      expect(middleware2).toBeCalledWith(ctx, expect.any(Function));
      expect(next).toBeCalledTimes(1);
    });
  });
});
