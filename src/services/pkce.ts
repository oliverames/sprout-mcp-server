import crypto from "node:crypto";

/**
 * PKCE (Proof Key for Code Exchange, RFC 7636) support for the interactive
 * "Sign in with Sprout" flow. PKCE lets a public client (one that cannot keep
 * a secret, like a distributed MCP bundle) run the authorization-code flow
 * safely: instead of proving identity with a client secret, the client proves
 * it started the flow by presenting a verifier whose hash it sent up front.
 */

export interface PkcePair {
  /** High-entropy random string sent on the token exchange. Keep it in memory only. */
  verifier: string;
  /** base64url(SHA-256(verifier)), sent on the authorize request. */
  challenge: string;
}

/** base64url encoding (RFC 4648 §5): standard base64 with +/ → -_ and no padding. */
function base64url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Create a PKCE verifier/challenge pair using the S256 method.
 * 32 random bytes → 43-char base64url verifier (within RFC 7636's 43-128 range).
 */
export function createPkcePair(): PkcePair {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(
    crypto.createHash("sha256").update(verifier).digest()
  );
  return { verifier, challenge };
}
