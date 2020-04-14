'use strict'

const { test } = require('tap')
const { build, closeMongo } = require('../helper')

test('Test Points API', async (t) => {
  const app = await build(t)

  t.tearDown(async () => {
    app.mongo.close()
    await closeMongo()
  })

  t.test('Test Upload', async (t) => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/points/upload',
      payload: {
        file: 'ImFkZHJlc3MiLCJsYXQiLCJsbmciLCJuYW1lIiwibG9jYXRpb25UeXBlIiwicG9pbnRUeXBlIiwiY2F0ZWdvcnlUeXBlIgoiVmlhIFNlbWV0ZWxsZSwgMjYgQW5ncmkgKFNBKSIsIjQwLjc0MzY5NDkiLCIxNC41NzE0Mjc5IiwiV2VCZWV0bGUgUy5yLmwuIiwicHJpdmF0byIsImNlbnRybyByYWNjb2x0YSIsImFsaW1lbnRhcmkiCg=='
      }
    })
    t.equal(JSON.parse(res.body).result, 'ok')
  })

  t.test('Test Near', async (t) => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/points/near',
      payload: {
        distance: 5000,
        lat: 40.7598419,
        lng: 14.5550957
      }
    })
    t.equal(JSON.parse(res.body).length, 1)
  })

  t.test('Test Report', async (t) => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/points/report',
      payload: {
        address: 'Via Semetelle, 26 Angri (SA)',
        lat: 40.7436949,
        lng: 14.5714279,
        name: 'WeBeetle S.r.l.',
        locationType: 'privato',
        pointType: 'centro raccolta',
        categoryType: 'alimentari'
      }
    })
    const obj = JSON.parse(res.body)
    t.equal(obj.name, 'WeBeetle S.r.l.')
    t.equal(Object.prototype.hasOwnProperty.call(obj, '_id'), true)
  })

  t.end()
})
