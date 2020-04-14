'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const JWT = require('../../src/plugins/jwt')

test('JWT Plugin Model Test Sign And Verify', async (t) => {
  const fastify = Fastify()
  fastify.register(JWT)

  await fastify.ready()

  const token = fastify.jwt.sign({ name: 'Admin', role: 'ADMIN' })
  const verify = fastify.jwt.verify(token)
  t.equal(verify.name, 'Admin')
  t.equal(verify.role, 'ADMIN')
})
