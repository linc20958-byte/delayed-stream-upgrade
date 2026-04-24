'use strict';

const { test } = require('node:test');
const common = require('../common');
const assert = common.assert;
const DelayedStream = common.DelayedStream;

test('create pauses source by default', () => {
  const source = common.createTestStream();
  let pauseCalls = 0;
  const origPause = source.pause.bind(source);
  source.pause = function patchedPause() {
    pauseCalls++;
    return origPause.apply(source, arguments);
  };

  DelayedStream.create(source);
  assert.strictEqual(pauseCalls, 1);
});

test('pauseStream: false skips auto pause', () => {
  const source = common.createTestStream();
  let pauseCalls = 0;
  const origPause = source.pause.bind(source);
  source.pause = function patchedPause() {
    pauseCalls++;
    return origPause.apply(source, arguments);
  };

  DelayedStream.create(source, { pauseStream: false });
  assert.strictEqual(pauseCalls, 0);
});
