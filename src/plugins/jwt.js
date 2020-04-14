'use strict'

const fp = require('fastify-plugin')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = fp(async function (fastify, opts) {
  class JWT {
    sign (payload) {
      return jwt.sign(payload, process.env.JWT_KEY)
    }

    verify (token) {
      return jwt.verify(token, process.env.JWT_KEY)
    }
  }

  fastify.decorate('jwt', new JWT())
}, { name: 'JWT' })
