const requiredEnvVars = [
  "DATABRICKS_HOST",
  "DATABRICKS_CLIENT_ID",
  "DATABRICKS_CLIENT_SECRET",
  "SACHCARE_API_URL",
] as const;

type DatabricksTokenResponse = {
  access_token: string;
};

export function getEnv(name: (typeof requiredEnvVars)[number]): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export async function getDatabricksAccessToken(): Promise<string> {
  const host = getEnv("DATABRICKS_HOST").replace(/\/+$/, "");
  const clientId = getEnv("DATABRICKS_CLIENT_ID");
  const clientSecret = getEnv("DATABRICKS_CLIENT_SECRET");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "all-apis",
  });

  const res = await fetch(`${host}/oidc/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status})`);
  const json = (await res.json()) as DatabricksTokenResponse;
  if (!json.access_token) throw new Error("Token response missing access_token");
  return json.access_token;
}
