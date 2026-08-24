const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredApiBaseUrl ||
  "http://localhost:3001/api/v1"
).replace(/\/$/, "");

if (import.meta.env.PROD && !configuredApiBaseUrl) {
  console.error(
    "VITE_API_BASE_URL is required for a production PRISM build.",
  );
}
