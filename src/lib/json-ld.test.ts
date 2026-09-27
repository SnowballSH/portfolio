import { describe, expect, test } from "bun:test";
import { serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  test("cannot close the surrounding script element", () => {
    const serialized = serializeJsonLd({ name: "</script><script>alert(1)" });
    expect(serialized).not.toContain("</script>");
    expect(JSON.parse(serialized)).toEqual({
      name: "</script><script>alert(1)",
    });
  });
});
