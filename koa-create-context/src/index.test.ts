import createContext from "./index";

describe("createContext()", () => {
  it("should proxy properties on the request", () => {
    const ctx = createContext({
      method: "POST"
    });
    expect(ctx).toEqual(
      expect.objectContaining({
        request: expect.objectContaining({
          method: "POST"
        })
      })
    );
  });

  it("should proxy properties on the response", () => {
    const ctx = createContext({
      status: 201,
      body: { data: { foo: "bar" } }
    });
    expect(ctx).toEqual(
      expect.objectContaining({
        response: expect.objectContaining({
          status: 201,
          body: { data: { foo: "bar" } }
        })
      })
    );
  });

  it("should contain additional properties on the context", () => {
    const ctx = createContext({
      xyz: "123"
    });
    expect(ctx).toEqual(
      expect.objectContaining({
        xyz: "123"
      })
    );
  });

  it("should contain the headers on the request", () => {
    const ctx = createContext({
      req: {
        header: {
          authorization: "Bearer 123"
        }
      }
    });
    expect(ctx.get("Authorization")).toEqual("Bearer 123");
  });
});
