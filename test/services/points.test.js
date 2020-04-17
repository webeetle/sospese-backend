'use strict'

const { test } = require('tap')
const { build, closeMongo } = require('../helper')

test('Test Points API', async (t) => {
  const app = await build(t)
  let tempId = ''

  t.tearDown(async () => {
    await closeMongo()
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
        categoryType: 'alimentari',
        contacts: [
          'info@webeetle.com'
        ]
      }
    })
    const obj = JSON.parse(res.body)
    tempId = obj._id
    t.equal(obj.name, 'WeBeetle S.r.l.')
    t.equal(Object.prototype.hasOwnProperty.call(obj, '_id'), true)
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
    const obj = JSON.parse(res.body)
    t.equal(obj[0].name, 'WeBeetle S.r.l.')
    t.ok(obj[0].dist.calculated)
  })

  t.test('Test Vote Up', async (t) => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/points/vote/${tempId}`,
      payload: {
        type: 'up'
      }
    })
    const obj = JSON.parse(res.body)
    t.equal(obj.message, 'ok')
  })

  t.test('Test Donation', async (t) => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/points/donation/${tempId}`,
      payload: {
        message: 'donare è bello '
      }
    })
    const obj = JSON.parse(res.body)
    t.equal(obj.message, 'ok')
  })

  t.test('Test Stast', async (t) => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/points/stats'
    })
    const obj = JSON.parse(res.body)
    t.equal(obj.points, 1)
    t.equal(obj.donations, 1)
  })

  t.test('Test GET Point By id', async (t) => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/points/${tempId}`
    })
    const obj = JSON.parse(res.body)
    t.equal(obj.name, 'WeBeetle S.r.l.')
  })

  t.test('Test Vote Up Fail', async (t) => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/points/vote/testfail',
      payload: {
        type: 'up'
      }
    })
    t.equal(res.statusCode, 404)
  })

  t.test('Test Donation Fail', async (t) => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/points/donation/testfail',
      payload: {
        message: 'donare è bello '
      }
    })
    t.equal(res.statusCode, 404)
  })

  t.test('Test GET Point By id Fail', async (t) => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/points/testfail'
    })
    t.equal(res.statusCode, 404)
  })

  t.end()
})
