'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const Mongoose = require('../../src/plugins/mongoose')

test('mongoose works standalone', async (t) => {
  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  let Point = await fastify.mongo.model('Point')
  let points = await Point.find({})
  t.equal(points.length, 0)
})
