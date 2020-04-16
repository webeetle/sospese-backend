'use strict'

const fp = require('fastify-plugin')
const cors = require('fastify-cors')

module.exports = fp(async (fastify, opts) => {
  fastify.register(cors, {})
}, { name: 'cors' })
