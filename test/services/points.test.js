'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('points is loaded', async (t) => {
  const app = build(t)

  const res = await app.inject({
    url: '/points'
  })
  t.equal(res.payload, [])
})
