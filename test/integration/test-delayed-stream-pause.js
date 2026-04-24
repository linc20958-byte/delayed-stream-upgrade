'use strict';

const { test } = require('node:test');
const common = require('../common');
const assert = common.assert;
const DelayedStream = common.DelayedStream;

test('pause delegates to source', () => {
  const source = common.createTestStream();
  const delayedStream = DelayedStream.create(source, { pauseStream: false });

  let pauseCalls = 0;
  const origPause = source.pause.bind(source);
  source.pause = function patchedPause() {
    pauseCalls++;
    return origPause.apply(source, arguments);
  };

  delayedStream.pause();
  assert.strictEqual(pauseCalls, 1);
});
