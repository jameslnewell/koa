import { ParameterizedContext } from "koa";
import createContext from "koa-create-mock-context";
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
  const aMiddleware = jest.fn(implementation);
  const bMiddleware = jest.fn(implementation);
  const multiMiddleware = jest.fn(implementation);

  const router = new Router()
    .use(useMiddleware)
    .any("/", anyMiddleware)
    .get("/", getMiddleware)
    .post("/", postMiddleware)
    .put("/", putMiddleware)
    .delete("/", deleteMiddleware)
    .get("/a", aMiddleware)
    .get("/b", bMiddleware)
    .get(["/x", "/y"], multiMiddleware);

  beforeEach(() => {
    useMiddleware.mockClear();
    anyMiddleware.mockClear();
    getMiddleware.mockClear();
    postMiddleware.mockClear();
    putMiddleware.mockClear();
    deleteMiddleware.mockClear();
    aMiddleware.mockClear();
    bMiddleware.mockClear();
    multiMiddleware.mockClear();
  });

  describe(".middleware ()", () => {
    it.only("should call the USE middleware and the ANY middleware", async () => {
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

    it("should call the USE middleware and the A middleware", async () => {
      const ctx = createContext({ method: "get", path: "/a" });
      const next = jest.fn();
      await router.middleware()(ctx, next);
      expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
      expect(aMiddleware).toBeCalledWith(ctx, expect.any(Function));
      expect(next).toBeCalledTimes(1);
    });

    it("should call the USE middleware and the B middleware", async () => {
      const ctx = createContext({ method: "get", path: "/b" });
      const next = jest.fn();
      await router.middleware()(ctx, next);
      expect(useMiddleware).toBeCalledWith(ctx, expect.any(Function));
      expect(bMiddleware).toBeCalledWith(ctx, expect.any(Function));
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
  });
});
