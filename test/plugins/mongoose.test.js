'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const Mongoose = require('../../src/plugins/mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mongod = new MongoMemoryServer()

test('Mongo Plugin Model Test', async (t) => {
  process.env.MONGO = await mongod.getUri()

  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  const Point = await fastify.mongo.model('Point')
  const points = await Point.find({})
  fastify.mongo.close()
  t.equal(points.length, 0)
  await mongod.stop()
})

test('Mongo Plugin Connection Test', async (t) => {
  process.env.MONGO = await mongod.getUri()

  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  const connection = await fastify.mongo.connection()
  fastify.mongo.close()
  t.equal(connection, true)
  await mongod.stop()
})

test('Mongo Plugin Connection Two Times Test', async (t) => {
  process.env.MONGO = await mongod.getUri()

  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  await fastify.mongo.connection()
  const connection = await fastify.mongo.connection()
  fastify.mongo.close()
  t.equal(connection, 'already connected')
  await mongod.stop()
})

test('Mongo Plugin Close Connection Test No Error', async (t) => {
  process.env.MONGO = await mongod.getUri()

  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  await fastify.mongo.connection()
  const closeConnection = fastify.mongo.close()
  t.equal(closeConnection, true)
  await mongod.stop()
})

test('Mongo Plugin Close Connection Test With Error', async (t) => {
  process.env.MONGO = await mongod.getUri()

  const fastify = Fastify()
  fastify.register(Mongoose)

  await fastify.ready()

  const closeConnection = fastify.mongo.close()
  t.equal(closeConnection, false)
  await mongod.stop()
})
