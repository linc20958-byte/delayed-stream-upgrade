'use strict';

const { test } = require('node:test');
const common = require('../common');
const assert = common.assert;
const DelayedStream = common.DelayedStream;

test('delay events until resume', () => {
  const source = common.createTestStream();
  const delayedStream = DelayedStream.create(source, { pauseStream: false });

  const params = [];
  source.on('foo', (param) => {
    params.push(param);
  });

  source.emit('foo', 1);
  source.emit('foo', 2);

  assert.deepStrictEqual(params, [1, 2]);

  const delayedFoo = [];
  delayedStream.on('foo', (v) => delayedFoo.push(v));

  let sourceResumeCalls = 0;
  const origResume = source.resume.bind(source);
  source.resume = function patchedResume() {
    sourceResumeCalls++;
    return origResume.apply(source, arguments);
  };

  delayedStream.resume();
  assert.deepStrictEqual(delayedFoo, [1, 2]);
  assert.strictEqual(sourceResumeCalls, 1);

  delayedStream.resume();
  assert.strictEqual(sourceResumeCalls, 2);

  delayedFoo.length = 0;
  source.emit('foo', 3);
  assert.deepStrictEqual(delayedFoo, [3]);
});
