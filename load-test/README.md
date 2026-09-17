# k6 load testing

These scripts test the existing API without adding endpoints.

## Safety

`api.js` and `browse.js` use only read-only endpoints:

- `GET /health`
- `GET /api/foods`
- `GET /api/categories`

They do not create, update, or delete database records.

`order-flow.js` is disabled unless `ENABLE_WRITES=true`. Do not enable it against production. It creates real orders and requires a disposable staging database and a dedicated test account.

The scripts do not print passwords or JWT tokens.

## What k6 measures

k6 reports:

- Request count and requests per second
- Average HTTP request duration
- p90, p95, and p99 duration
- HTTP failure rate
- Checks that passed and failed
- Active virtual users
- HTTP status codes

The default thresholds are:

```text
HTTP failures < 5%
p95 response time < 1000 ms
```

These are starting points, not guarantees. Change them in the scripts to match your hosting plan and user experience requirements.

## Install k6

Windows:

```powershell
winget install --id GrafanaLabs.k6
```

## Configure the target

Local backend:

```powershell
$env:BASE_URL = "http://127.0.0.1:4000"
```

Deployed backend:

```powershell
$env:BASE_URL = "https://your-backend-domain.example"
```

Do not include `/api` at the end of `BASE_URL`; the scripts include it where required.

## Run the read-only test

```powershell
k6 run load-test/api.js
```

The test ramps through:

```text
10 → 25 → 50 → 100 → 200 virtual users → ramp down
```

Each virtual user waits between requests to model browsing rather than sending a tight request loop.

For the two-request browsing flow:

```powershell
k6 run load-test/browse.js
```

To change the delay between iterations:

```powershell
$env:SLEEP_SECONDS = "5"
k6 run load-test/api.js
```

## Testing one fixed level

For a single level, use the k6 command-line override:

```powershell
k6 run --vus 10 --duration 30s load-test/api.js
k6 run --vus 50 --duration 30s load-test/api.js
k6 run --vus 100 --duration 30s load-test/api.js
k6 run --vus 200 --duration 30s load-test/api.js
```

## Order-flow test

Only use a dedicated staging customer and a food ID from that same staging database:

```powershell
$env:BASE_URL = "http://127.0.0.1:4000"
$env:TEST_EMAIL = "staging-test@example.com"
$env:TEST_PASSWORD = "use-a-staging-password"
$env:TEST_FOOD_ID = "staging-food-id"
$env:ENABLE_WRITES = "true"
$env:VUS = "10"
$env:DURATION = "30s"
k6 run load-test/order-flow.js
```

This creates orders. Do not use real customer credentials or a production database.

## Interpreting results

`p95` means 95% of requests completed at or below that time. If p95 is 800 ms, 95 of 100 requests were no slower than 800 ms; the slowest 5% took longer.

The error rate is the percentage of requests that failed. HTTP 429 responses may indicate the application's rate limiter rather than server capacity.

Watch for:

- p95 or p99 increasing sharply at a specific user level
- HTTP 429 rate-limit responses
- HTTP 500/503 responses
- connection-pool or timeout errors
- increasing database latency
- large responses from order/admin endpoints

The backend currently uses a Prisma pool default of 10 connections per instance. Vercel serverless instances can multiply total database connections, so inspect the PostgreSQL provider's pooled connection metrics during a test.

## Production safety

Prefer local or staging. If production testing is approved:

1. Run only `api.js` or read-only endpoints first.
2. Use a short duration and the lowest level first.
3. Start outside business hours.
4. Monitor Vercel and PostgreSQL metrics.
5. Stop immediately if errors, latency, or rate limits rise sharply.
6. Never run `order-flow.js` against production.

## Browser console sanity check

This is not a real concurrent-user test. It launches 100 requests from one browser at once:

```js
const start = performance.now();
Promise.all(
  Array.from({ length: 100 }, () => fetch("/api/foods"))
).then(async (responses) => {
  const end = performance.now();
  console.log("Requests:", responses.length);
  console.log("Successful:", responses.filter((response) => response.ok).length);
  console.log("Failed:", responses.filter((response) => !response.ok).length);
  console.log("Total time:", Math.round(end - start), "ms");
});
```

Use k6 for the actual staged test. One hundred browser requests are not the same as 100 realistic users.
