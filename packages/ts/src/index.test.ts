import { describe, expect, test, mock } from "bun:test";
import { type SchemaValidator, type Router, useSearchParams } from "./index";

type SchemaType = { username: string; id: number; isAdmin: boolean };

const schema: SchemaValidator<SchemaType> = (search: Record<string, any>) => ({
  username: search?.username ?? "defaultUser",
  id: parseInt(`${search?.id ?? 1}`),
  isAdmin: Boolean(search?.isAdmin),
});
const query = "";

const routerPushSpy = mock();
const router: Router = {
  push: routerPushSpy,
};

describe("useSearchParams", () => {
  test("returns the default schema value if no query is provided", () => {
    const { username, id, isAdmin } = useSearchParams({
      schema,
      query,
      router,
    });
    expect(username).toBe("defaultUser");
    expect(id).toBe(1);
    expect(isAdmin).toBe(false);
  });

  test("returns the correct value if query is provided", () => {
    const { username, id, isAdmin } = useSearchParams({
      schema,
      query: "username=iamhectorsosa&id=7&isAdmin=true",
      router,
    });
    expect(username).toBe("iamhectorsosa");
    expect(id).toBe(7);
    expect(isAdmin).toBe(true);
  });

  test("supports search params updates", () => {
    const { setQuery } = useSearchParams({
      schema,
      query,
      router,
    });

    setQuery({ username: "samuelhulla" });

    expect(routerPushSpy).toHaveBeenLastCalledWith(
      "?username=samuelhulla&id=1&isAdmin=false"
    );
  });

  test("supports functional search params updates", () => {
    const { setQuery } = useSearchParams({
      schema,
      query,
      router,
    });

    setQuery(({ id }) => ({ id: id + 1 }));

    expect(routerPushSpy).toHaveBeenLastCalledWith(
      "?username=defaultUser&id=2&isAdmin=false"
    );
  });

  test("supports search params reset", () => {
    const { clearQuery } = useSearchParams({
      schema,
      query: "username=iamhectorsosa&id=7&isAdmin=true",
      router,
    });

    clearQuery();

    expect(routerPushSpy).toHaveBeenLastCalledWith(
      "?username=defaultUser&id=1&isAdmin=false"
    );
  });
});
