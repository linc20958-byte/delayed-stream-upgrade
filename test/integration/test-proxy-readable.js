'use strict';

const { test } = require('node:test');
const common = require('../common');
const assert = common.assert;
const DelayedStream = common.DelayedStream;
const { Stream } = common;

test('readable getter proxies source.readable', () => {
  const source = new Stream();
  const delayedStream = DelayedStream.create(source, { pauseStream: false });

  const sentinel = {};
  source.readable = sentinel;
  assert.strictEqual(delayedStream.readable, sentinel);
});
