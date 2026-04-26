# Sachcare Trusted Health Insights

This app uses a server-side API route (`/api/ask`) to:

1. Exchange Databricks OAuth client credentials for an access token
2. Call your Databricks App backend at `SACHCARE_API_URL/api/ask`
3. Return the response to the frontend

## 1) Local setup

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Fill it with your real values:

```bash
DATABRICKS_HOST=https://dbc-...cloud.databricks.com
DATABRICKS_CLIENT_ID=...
DATABRICKS_CLIENT_SECRET=...
SACHCARE_API_URL=https://...aws.databricksapps.com
```

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` (or the URL printed by Vite).

## 2) Quick backend connectivity test

With dev server running, test the local proxy route:

```bash
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"Find ICU in Bihar"}'
```

If env vars are correct, this calls Databricks through the server route and returns JSON.

## 3) Deploy to Vercel / v0

Do not expose Databricks secrets in frontend code. Set these as **Vercel Environment Variables**:

- `DATABRICKS_HOST`
- `DATABRICKS_CLIENT_ID`
- `DATABRICKS_CLIENT_SECRET`
- `SACHCARE_API_URL`

Then deploy as a standard Vite/TanStack Start app. The same `/api/ask` server route will run on Vercel and keep secrets server-side.
