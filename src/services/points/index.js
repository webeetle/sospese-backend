'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.get('/api/points', async function (request, reply) {
    let Point = await fastify.mongo.model('Point')
    let points = await Point.find({});
    return points
  })
}, { name: 'service_points'})