import { ParameterizedContext } from "koa";
import createContext from "koa-create-context";
import Router from "./index";

describe("Router", () => {
  const implementation = async (_: ParameterizedContext, next: Function) =>
    next();

  const useMiddleware = jest.fn(implementation);
  const anyMiddleware = jest.fn(implementation);
  const getMiddleware = jest.fn(implementation);
  const postMiddleware = jest.fn(implementation);
  const putMiddleware = jest.fn(implementation);
  const deleteMiddleware = jest.fn(implementation);
  const appMiddleware = jest.fn(implementation);
  const blogMiddleware = jest.fn(implementation);
  const profileMiddleware = jest.fn(implementation);
  const multiMiddleware = jest.fn(implementation);

  const router = new Router()
    .use(useMiddleware)
    .any("/", anyMiddleware)
    .get("/", getMiddleware)
    .post("/", postMiddleware)
    .put("/", putMiddleware)
    .delete("/", deleteMiddleware)
    .get("/app", appMiddleware)
    .get("/blog", blogMiddleware)
    .get("/~:username", profileMiddleware)
    .get(["/x", "/y"], multiMiddleware);

  beforeEach(() => {
    useMiddleware.mockClear();
    anyMiddleware.mockClear();
    getMiddleware.mockClear();
    postMiddleware.mockClear();
    putMiddleware.mockClear();
    deleteMiddleware.mockClear();
    blogMiddleware.mockClear();
    appMiddleware.mockClear();
    multiMiddleware.mockClear();
  });

  it("should call the USE middleware and the ANY middleware", async () => {
    const ctx = createContext({ method: "post", path: "/" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(anyMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the GET middleware", async () => {
    const ctx = createContext({ method: "get", path: "/" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(getMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the POST middleware", async () => {
    const ctx = createContext({ method: "post", path: "/" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(postMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the PUT middleware", async () => {
    const ctx = createContext({ method: "put", path: "/" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(putMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the DELETE middleware", async () => {
    const ctx = createContext({ method: "delete", path: "/" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(deleteMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the app middleware", async () => {
    const ctx = createContext({ method: "get", path: "/app" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(appMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the blog middleware", async () => {
    const ctx = createContext({ method: "get", path: "/blog" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(blogMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the username middleware", async () => {
    const ctx = createContext({ method: "get", path: "/~jameslnewell" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(profileMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(ctx.params).toEqual({
      username: "jameslnewell"
    });
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the multi middleware when the path is /x", async () => {
    const ctx = createContext({ method: "get", path: "/x" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(multiMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should call the USE middleware and the multi middleware when the path is /y", async () => {
    const ctx = createContext({ method: "get", path: "/y" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(multiMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });

  it("should adjust the path", async () => {
    const ctx = createContext({ method: "get", path: "/blog/post" });
    const next = jest.fn();
    await router.middleware()(ctx, next);
    expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(multiMiddleware).toBeCalledWith(ctx, expect.any(Function));
    expect(next).toBeCalledTimes(1);
  });
});
