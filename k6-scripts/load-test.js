import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        burst_scenario: {
            executor: 'per-vu-iterations',
            vus: 5000,
            iterations: 1,
            maxDuration: '30s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],
    }
};

export default function () {
    const url = 'http://localhost:3000/api/scrape';
    const payload = JSON.stringify({
        urls: [
            `https://books.toscrape.com/catalogue/page-1.html`,
            `https://books.toscrape.com/catalogue/page-2.html`,
            `https://books.toscrape.com/catalogue/page-3.html`
        ],
    });

    const res = http.post(url, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46YWRtaW4=' // admin:admin base64
        }
    });

    check(res, {
        'status is 202': (r) => r.status === 202,
    });
}
