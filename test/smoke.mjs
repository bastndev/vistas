import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import { hello } from '../dist/index.js';

// ESM build
assert.equal(hello('world'), 'Hello, world!');

// The CJS build must load and expose the same API.
const require = createRequire(import.meta.url);
const cjs = require('../dist/index.cjs');
assert.equal(typeof cjs.hello, 'function', 'CJS build exports hello');

console.log('✅ smoke test passed');
