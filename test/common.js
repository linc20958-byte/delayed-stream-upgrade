'use strict';

const { Stream } = require('node:stream');

/**
 * Legacy-style Stream instance (plain Stream in modern Node has no pause/resume).
 */
function createTestStream() {
  const s = new Stream();
  if (typeof s.pause !== 'function') {
    s.pause = function noopPause() {
      return this;
    };
  }
  if (typeof s.resume !== 'function') {
    s.resume = function noopResume() {
      return this;
    };
  }
  return s;
}

module.exports = {
  DelayedStream: require('../lib/delayed_stream.js'),
  assert: require('node:assert'),
  PORT: 49252,
  createTestStream,
  Stream,
};
