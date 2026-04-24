'use strict';

const { test } = require('node:test');
const common = require('../common');
const assert = common.assert;
const DelayedStream = common.DelayedStream;

test('pipe calls resume on delayed stream', () => {
  const source = common.createTestStream();
  const delayedStream = DelayedStream.create(source, { pauseStream: false });

  let resumeCalls = 0;
  const origResume = delayedStream.resume.bind(delayedStream);
  delayedStream.resume = function patchedResume() {
    resumeCalls++;
    return origResume.apply(delayedStream, arguments);
  };

  delayedStream.pipe(common.createTestStream());
  assert.strictEqual(resumeCalls, 1);
});
