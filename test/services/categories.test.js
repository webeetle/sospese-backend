'use strict'

const { test } = require('tap')
const { build, closeMongo } = require('../helper')

test('Test Categories API', async (t) => {
  const app = await build(t)

  t.tearDown(async () => {
    await closeMongo()
  })

  t.test('Test Stast', async (t) => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/categories'
    })
    const obj = JSON.parse(res.body)
    t.equal(obj.length, 0)
  })

  t.end()
})
