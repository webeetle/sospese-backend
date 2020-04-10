'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/points', async function (request, reply) {
    let Point = await fastify.mongo.model('Point')
    let points = await Point.find({});
    return points
  })
}

module.exports.autoPrefix = '/api'