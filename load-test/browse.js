import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.BASE_URL || 'http://127.0.0.1:4000').replace(/\/+$/, '');
const sleepSeconds = Number(__ENV.SLEEP_SECONDS || 2);
const trendStats = ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'];

export const options = {
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
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1000']
  },
  summaryTrendStats: trendStats
};

export default function () {
  const responses = http.batch([
    ['GET', `${baseUrl}/api/foods`, null, { tags: { endpoint: 'foods' } }],
    ['GET', `${baseUrl}/api/categories`, null, { tags: { endpoint: 'categories' } }]
  ]);

  check(responses[0], {
    'foods returns 2xx': (response) => response.status >= 200 && response.status < 300
  });
  check(responses[1], {
    'categories returns 2xx': (response) => response.status >= 200 && response.status < 300
  });

  sleep(sleepSeconds);
}
