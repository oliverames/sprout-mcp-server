import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { createPkcePair } from "../../src/services/pkce.js";

describe("createPkcePair", () => {
  it("produces a 43-char base64url verifier (32 random bytes, no padding)", () => {
    const { verifier } = createPkcePair();
    expect(verifier).toHaveLength(43);
    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("produces a base64url challenge with no padding", () => {
    const { challenge } = createPkcePair();
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(challenge).not.toContain("=");
  });

  it("challenge is the S256 hash of the verifier (server-recomputable)", () => {
    const { verifier, challenge } = createPkcePair();
    const expected = crypto
      .createHash("sha256")
      .update(verifier)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(challenge).toBe(expected);
  });

  it("generates a unique pair on each call", () => {
    const a = createPkcePair();
    const b = createPkcePair();
    expect(a.verifier).not.toBe(b.verifier);
    expect(a.challenge).not.toBe(b.challenge);
  });
});
