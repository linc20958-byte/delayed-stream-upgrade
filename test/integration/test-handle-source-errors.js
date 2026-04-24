'use strict';

const { test } = require('node:test');
const common = require('../common');
const DelayedStream = common.DelayedStream;

test('source error does not throw (no-op error listener)', () => {
  const source = common.createTestStream();
  DelayedStream.create(source, { pauseStream: false });

  source.emit('error', new Error('something went wrong'));
});
