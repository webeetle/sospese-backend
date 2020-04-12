'use strict'

const { test } = require('tap')
const { build, closeMongo } = require('../helper')

test('Points API Test GET', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/api/points'
  })
  app.mongo.close()
  await closeMongo()
  t.deepEqual(JSON.parse(res.payload), [])
})

test('Points API Test Upload', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/points/upload',
    payload: {
      file: 'ImFkZHJlc3MiLCJsYXQiLCJsbmciLCJuYW1lIiwibG9jYXRpb25UeXBlIiwicG9pbnRUeXBlIiwiY2F0ZWdvcnlUeXBlIgoiVmlhIFNlbWV0ZWxsZSwgMjYgQW5ncmkgKFNBKSIsIjQwLjc0MzY5NDkiLCIxNC41NzE0Mjc5IiwiV2VCZWV0bGUgUy5yLmwuIiwicHJpdmF0byIsImNlbnRybyByYWNjb2x0YSIsImFsaW1lbnRhcmkiCg=='
    }
  })
  app.mongo.close()
  await closeMongo()
  t.deepEqual(JSON.parse(res.payload).result, 'ok')
})

test('Points API Test Near', async (t) => {
  const app = await build(t)

  // create one point for test
  await app.inject({
    method: 'POST',
    url: '/api/points/upload',
    payload: {
      file: 'ImFkZHJlc3MiLCJsYXQiLCJsbmciLCJuYW1lIiwibG9jYXRpb25UeXBlIiwicG9pbnRUeXBlIiwiY2F0ZWdvcnlUeXBlIgoiVmlhIFNlbWV0ZWxsZSwgMjYgQW5ncmkgKFNBKSIsIjQwLjc0MzY5NDkiLCIxNC41NzE0Mjc5IiwiV2VCZWV0bGUgUy5yLmwuIiwicHJpdmF0byIsImNlbnRybyByYWNjb2x0YSIsImFsaW1lbnRhcmkiCg=='
    }
  })

  const res = await app.inject({
    method: 'POST',
    url: '/api/points/near',
    payload: {
      distance: 5000,
      lat: 40.7598419,
      lng: 14.5550957
    }
  })
  app.mongo.close()
  await closeMongo()
  t.deepEqual(JSON.parse(res.payload).length, 1)
})
