'use strict'

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../src')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mongod = new MongoMemoryServer()

function config () {
  return {}
}

async function build (t) {
  process.env.MONGO = await mongod.getUri()

  const app = Fastify()
  app.register(fp(App), config())

  t.tearDown(app.close.bind(app))
  return app
}

async function closeMongo () {
  await mongod.stop()
}

module.exports = {
  config,
  build,
  closeMongo
}
