import { ParameterizedContext } from "koa";
import createContext from "koa-create-context";
import Router from "./index";

describe("Router", () => {
  const implementation = async (_: ParameterizedContext, next: Function) =>
    next();

  const globalMiddleware = jest.fn(implementation);
  const rootMiddleware = jest.fn(implementation);
  const anyMiddleware = jest.fn(implementation);

  const listTeamMiddleware = jest.fn(implementation);
  const createTeamMiddleware = jest.fn(implementation);
  const updateTeamMiddleware = jest.fn(implementation);
  const deleteTeamMiddleware = jest.fn(implementation);

  const blogPostMiddleware = jest.fn(implementation);
  const profileMiddleware = jest.fn(implementation);
  const multiMiddleware = jest.fn(implementation);

  const apiMiddleware = jest.fn(implementation);

  const router = new Router()
    .use(globalMiddleware)

    .get("/", rootMiddleware)
    .any("/any", anyMiddleware)

    .get("/team", listTeamMiddleware)
    .post("/team", createTeamMiddleware)
    .put("/team/:id", updateTeamMiddleware)
    .delete("/team/:id", deleteTeamMiddleware)

    .get("/blog/:date/:post", blogPostMiddleware)
    .get("/~:username", profileMiddleware)
    .get(["/x", "/y"], multiMiddleware)

    .use("/api", apiMiddleware);

  beforeEach(() => {
    globalMiddleware.mockClear();

    rootMiddleware.mockClear();
    anyMiddleware.mockClear();

    listTeamMiddleware.mockClear();
    createTeamMiddleware.mockClear();
    updateTeamMiddleware.mockClear();
    deleteTeamMiddleware.mockClear();

    blogPostMiddleware.mockClear();
    profileMiddleware.mockClear();
    multiMiddleware.mockClear();

    apiMiddleware.mockClear();
  });

  it(`should call globalMiddleware when any method and any path is used`, async () => {
    await Promise.all(
      ["get", "post", "put", "delete"].map(method =>
        Promise.all(
          [
            "/",
            "/~jameslnewell",
            "/blog/2019-02/100-ways-to-fry-an-egg",
            "/foobar"
          ].map(async path => {
            const ctx = createContext({ method, path });
            const next = jest.fn();
            await router.handle(ctx, next);
            expect(globalMiddleware).toBeCalledWith(ctx, expect.any(Function));
            expect(next).toBeCalledTimes(1);
          })
        )
      )
    );
  });

  it("should call rootMiddleware when the method is get and the path is /", async () => {
    const ctx = createContext({ method: "get", path: "/" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(rootMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should not call rootMiddleware when the method is not get and path is /", async () => {
    await Promise.all(
      ["post", "put", "delete"].map(async method => {
        const ctx = createContext({ method, path: "/" });
        const next = jest.fn();
        await router.handle(ctx, next);
        expect(rootMiddleware).not.toBeCalled();
        expect(next).toBeCalledTimes(1);
      })
    );
  });

  it("should not call rootMiddleware when the path is not /", async () => {
    const ctx = createContext({ method: "get", path: "/xyz" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(rootMiddleware).not.toBeCalled();
    expect(next).toBeCalledTimes(1);
  });

  it("should call anyMiddleware when the method is anything and the path is /any", async () => {
    await Promise.all(
      ["get", "post", "put", "delete"].map(async method => {
        const ctx = createContext({ method, path: "/any" });
        const next = jest.fn();
        await router.handle(ctx, next);
        expect(anyMiddleware).toBeCalled();
        expect(next).toBeCalledTimes(1);
      })
    );
  });

  it("should not call anyMiddleware when the method is anything get and the path is not /any", async () => {
    await Promise.all(
      ["get", "post", "put", "delete"].map(async method => {
        const ctx = createContext({ method, path: "/anyz" });
        const next = jest.fn();
        await router.handle(ctx, next);
        expect(anyMiddleware).not.toBeCalled();
        expect(next).toBeCalledTimes(1);
      })
    );
  });

  it("should call listTeamMiddleware when the method is get and the path is get /team", async () => {
    const ctx = createContext({ method: "get", path: "/team" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(listTeamMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call createTeamMiddleware when the path is post /team", async () => {
    const ctx = createContext({ method: "post", path: "/team" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(createTeamMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call updateTeamMiddleware with params when the path is put /team", async () => {
    const ctx = createContext({ method: "put", path: "/team/123" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(updateTeamMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
    expect(ctx.params).toEqual({ id: "123" });
  });

  it("should call deleteTeamMiddleware with params when the path is put /team", async () => {
    const ctx = createContext({ method: "delete", path: "/team/123" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(deleteTeamMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
    expect(ctx.params).toEqual({ id: "123" });
  });

  it("should call blogPostMiddleware with params when the path is /blog/2019-02-01/abc-def", async () => {
    const ctx = createContext({
      method: "get",
      path: "/blog/2019-02-01/abc-def"
    });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(blogPostMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(ctx.params).toEqual({
      post: "abc-def",
      date: "2019-02-01"
    });
  });

  it("should call profileMiddleware with params when the path is /~jameslnewell", async () => {
    const ctx = createContext({ method: "get", path: "/~jameslnewell" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(profileMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(ctx.params).toEqual({
      username: "jameslnewell"
    });
    expect(next).toBeCalledTimes(1);
  });

  it("should call multiMiddleware when the path is /x", async () => {
    const ctx = createContext({ method: "get", path: "/x" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(multiMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call multiMiddleware when the path is /y", async () => {
    const ctx = createContext({ method: "get", path: "/y" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(globalMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(multiMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should adjust the path when the path is /api/user", async () => {
    expect.assertions(4);
    apiMiddleware.mockImplementation((ctx, next) => {
      expect(ctx.path).toEqual("/user");
      return next();
    });
    const ctx = createContext({ method: "post", path: "/api/user" });
    const next = jest.fn();
    await router.handle(ctx, next);
    expect(apiMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
    expect(ctx.path).toEqual("/api/user");
  });

  it("should support nested routers when the path is /foo/bar", async () => {
    const middleware = jest.fn(implementation);
    const ctx = createContext({ method: "get", path: "/foo/bar" });
    const next = jest.fn();
    const bar = new Router().get("/bar", middleware);
    const foo = new Router().use("/foo", bar.handle);
    await foo.handle(ctx, next);
    expect(middleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });
});
