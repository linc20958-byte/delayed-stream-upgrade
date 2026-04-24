'use strict';

const { test } = require('node:test');
const common = require('../common');
const assert = common.assert;
const DelayedStream = common.DelayedStream;

test('maxDataSize emits error when exceeded', () => {
  const source = common.createTestStream();
  const delayedStream = DelayedStream.create(source, {
    maxDataSize: 1024,
    pauseStream: false,
  });

  let err;
  delayedStream.on('error', (e) => {
    err = e;
  });

  source.emit('data', Buffer.alloc(1024));
  assert.strictEqual(err, undefined);

  source.emit('data', Buffer.alloc(1));
  assert.ok(err instanceof Error);
  assert.match(err.message, /maxDataSize/);
});
