'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const Mongoose = require('../../src/plugins/mongoose')

test('mongoose model find test', async (t) => {
  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  let Point = await fastify.mongo.model('Point')
  let points = await Point.find({})
  fastify.mongo.close()
  t.equal(points.length, 0)
})

test('mongoose connection test', async (t) => {
  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  let connection = await fastify.mongo.connection()
  fastify.mongo.close()
  t.equal(connection, true)
})

test('mongoose connection two time test', async (t) => {
  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  await fastify.mongo.connection()
  let connection = await fastify.mongo.connection()
  fastify.mongo.close()
  t.equal(connection, 'already connected')
})

test('mongoose close connection test ok', async (t) => {
  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  await fastify.mongo.connection()
  let closeConnection = fastify.mongo.close()
  t.equal(closeConnection, true)
})

test('mongoose close connection test error', async (t) => {
  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  let closeConnection = fastify.mongo.close()
  t.equal(closeConnection, false)
})