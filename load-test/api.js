import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.BASE_URL || 'http://127.0.0.1:4000').replace(/\/+$/, '');
const sleepSeconds = Number(__ENV.SLEEP_SECONDS || 2);
const thresholdOptions = {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<1000']
};
const trendStats = ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'];

const stagedOptions = {
  stages: [
    { target: 10, duration: '3s' },
    { target: 10, duration: '5s' },
    { target: 25, duration: '3s' },
    { target: 25, duration: '5s' },
    { target: 50, duration: '3s' },
    { target: 50, duration: '5s' },
    { target: 100, duration: '3s' },
    { target: 100, duration: '5s' },
    { target: 200, duration: '3s' },
    { target: 200, duration: '5s' },
    { target: 0, duration: '5s' }
  ],
  thresholds: thresholdOptions,
  summaryTrendStats: trendStats
};

export const options = Number(__ENV.VUS || 0) > 0
  ? { vus: Number(__ENV.VUS), duration: __ENV.DURATION || '10s', thresholds: thresholdOptions, summaryTrendStats: trendStats }
  : stagedOptions;

const endpoints = [
  { path: '/api/foods', name: 'foods' },
  { path: '/api/categories', name: 'categories' },
  { path: '/health', name: 'health' }
];

export default function () {
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const response = http.get(`${baseUrl}${endpoint.path}`, {
    tags: { endpoint: endpoint.name }
  });

  check(response, {
    [`${endpoint.name} returns 2xx`]: (res) => res.status >= 200 && res.status < 300,
    [`${endpoint.name} returns JSON`]: (res) => String(res.headers['Content-Type'] || '').includes('application/json')
  });

  sleep(sleepSeconds);
}
