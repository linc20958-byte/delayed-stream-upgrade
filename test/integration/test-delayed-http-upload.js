'use strict';

const { test } = require('node:test');
const common = require('../common');
const assert = common.assert;
const DelayedStream = common.DelayedStream;
const http = require('node:http');

test('delayed HTTP upload pipes full body', () => {
  const UPLOAD = Buffer.alloc(10 * 1024 * 1024);
  const host = '127.0.0.1';

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const delayed = DelayedStream.create(req, { maxDataSize: UPLOAD.length });

      setTimeout(() => {
        res.writeHead(200);
        delayed.pipe(res);
      }, 10);
    });

    server.on('error', reject);

    server.listen(common.PORT, host, () => {
      const request = http.request({
        method: 'POST',
        hostname: host,
        port: common.PORT,
      });

      request.on('error', reject);

      request.write(UPLOAD);
      request.end();

      request.on('response', (res) => {
        let received = 0;
        res
          .on('data', (chunk) => {
            received += chunk.length;
          })
          .on('end', () => {
            try {
              assert.strictEqual(received, UPLOAD.length);
              server.close(() => resolve());
            } catch (e) {
              server.close(() => reject(e));
            }
          })
          .on('error', reject);
      });
    });
  });
});
