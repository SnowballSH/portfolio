import { describe, expect, test } from "bun:test";
import { decodeEmail, encodeEmail } from "./email";

describe("email obfuscation", () => {
  test("round-trips an address", () => {
    expect(decodeEmail(encodeEmail("yinuo@snowballsh.com"))).toBe(
      "yinuo@snowballsh.com",
    );
  });

  test("hides the address from plain-text scans", () => {
    const encoded = encodeEmail("yinuo@snowballsh.com");
    expect(encoded).not.toContain("@");
    expect(encoded).not.toContain("snowballsh");
  });
});
