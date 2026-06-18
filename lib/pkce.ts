import crypto from "node:crypto";

// PKCE + state helpers (RFC 7636). nodejs runtime only.
export function randomString(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function challengeFromVerifier(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}
