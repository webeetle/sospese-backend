'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
}, { name: 'service_root'})
