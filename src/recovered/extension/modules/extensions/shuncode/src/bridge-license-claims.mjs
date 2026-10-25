// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/bridge-license-claims.js
init_define_SHUNCODE_BUILD_INFO();
function validateTokenClaims(claims, {
  now,
  issuer,
  audience,
  kind
}) {
  const record4 = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const timestamp = value => Number.isSafeInteger(value) && value >= 0;
  if (!record4(claims)) throw new Error("Invalid token claims");
  if (claims.iss !== issuer || claims.kind !== kind) throw new Error("Invalid token issuer or kind");
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.length || !audiences.every(v => typeof v === "string" && v.length > 0) || !audiences.includes(audience)) throw new Error("Invalid token audience");
  if (typeof claims.sub !== "string" || !claims.sub.trim()) throw new Error("Invalid token subject");
  if (!timestamp(claims.exp) || claims.exp <= now) throw new Error("Invalid or expired token expiry");
  for (const field2 of ["nbf", "iat"]) {
    if (claims[field2] !== void 0 && (!timestamp(claims[field2]) || claims[field2] > now + 60 || claims[field2] >= claims.exp)) throw new Error("Invalid token " + field2);
  }
  if (kind === "license") {
    if (!Array.isArray(claims.features) || !claims.features.length || !claims.features.every(v => typeof v === "string" && v.length > 0)) throw new Error("Invalid license features");
    if (typeof claims.installation_id !== "string" || !claims.installation_id.trim()) throw new Error("Invalid license installation");
    if (claims.entitlement_exp !== void 0 && claims.entitlement_exp !== null && (!timestamp(claims.entitlement_exp) || claims.entitlement_exp <= now || claims.exp > claims.entitlement_exp)) throw new Error("Invalid entitlement expiry");
  }
}

// extensions/shuncode/src/bridge-license-service.ts
export { validateTokenClaims };
