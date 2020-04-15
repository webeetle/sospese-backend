'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
  fastify.register(require('fastify-mongodb'), {
    forceClose: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    url: process.env.MONGO
  })
}, { name: 'mongo' })
