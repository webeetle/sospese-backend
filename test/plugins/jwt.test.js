'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const JWT = require('../../src/plugins/jwt')

test('JWT Plugin Model Test Sign And Verify', async (t) => {
  const fastify = Fastify()
  fastify.register(JWT)

  await fastify.ready()

  const token = fastify.jwt.sign({ name: 'Admin', role: 'ADMIN' })
  console.log('token', token)
  const verify = fastify.jwt.verify(token)
  console.log('verify', verify)
  t.equal(verify.name, 'Admin')
  t.equal(verify.role, 'ADMIN')
})
