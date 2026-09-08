const assert = require('assert/strict')
const fs = require('fs')
const vm = require('vm')
const babel = require('@babel/core')

const source = fs.readFileSync(
  require.resolve('../constant/imah-aing-status.js'),
  'utf8'
)
const { code } = babel.transformSync(source, {
  plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
})
const moduleExports = { exports: {} }
vm.runInNewContext(code, { module: moduleExports, exports: moduleExports.exports })

const { getImahAingStatusKey } = moduleExports.exports

assert.equal(
  getImahAingStatusKey({ phase: 'verified' }),
  'verified',
  'status harus diambil dari item list, bukan snapshot detail'
)
assert.equal(
  getImahAingStatusKey({ phase: 'verified', status: 'unverified' }),
  'verified',
  'phase harus diprioritaskan atas fallback status'
)
assert.equal(
  getImahAingStatusKey({ latest_complaint_status: { id: 'verified' }, phase: 'unverified' }),
  'verified',
  'latest_complaint_status harus diprioritaskan'
)
