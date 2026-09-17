import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.BASE_URL || 'http://127.0.0.1:4000').replace(/\/+$/, '');
const email = __ENV.TEST_EMAIL;
const password = __ENV.TEST_PASSWORD;
const foodId = __ENV.TEST_FOOD_ID;
const enableWrites = __ENV.ENABLE_WRITES === 'true';

export const options = {
  vus: Number(__ENV.VUS || 1),
  duration: __ENV.DURATION || '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1000']
  }
};

export default function () {
  if (!email || !password || !foodId) {
    throw new Error('Set TEST_EMAIL, TEST_PASSWORD, and TEST_FOOD_ID before running order-flow.js.');
  }

  if (!enableWrites) {
    throw new Error('Order creation is disabled. Set ENABLE_WRITES=true only against a disposable staging database.');
  }

  const login = http.post(`${baseUrl}/api/auth/login`, JSON.stringify({ email, password }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'login' }
  });

  check(login, { 'login returns 200': (response) => response.status === 200 });
  if (login.status !== 200) {
    sleep(2);
    return;
  }

  const token = login.json('data.token');
  if (!token) {
    throw new Error('Login response did not contain a token.');
  }

  const order = http.post(`${baseUrl}/api/orders`, JSON.stringify({
    orderType: 'TAKEAWAY',
    items: [{ foodId, quantity: 1 }]
  }), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    tags: { endpoint: 'create-order' }
  });

  check(order, { 'order creation returns 201': (response) => response.status === 201 });
  sleep(2);
}
