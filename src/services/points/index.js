'use strict'

const csvtojson = require('csvtojson/v2')
const S = require('fluent-schema')

module.exports = async (fastify, opts) => {
  fastify.post('/near', {
    schema: {
      body: S.object()
        .prop('distance', S.number().required())
        .prop('lat', S.number().required())
        .prop('lng', S.number().required()),
      reponse: S.object()
        .prop('200', S.array(S.object(S.ref('#near'))))
    }
  }, async (request, reply) => {
    const Point = await fastify.mongo.model('Point')

    const points = await Point.aggregate([{
      $geoNear: {
        near: { type: 'Point', coordinates: [request.body.lng, request.body.lat] },
        distanceField: 'dist.calculated',
        maxDistance: request.body.distance,
        includeLocs: 'dist.location',
        spherical: true
      }
    }]).sort({ 'dist.calculated': 1 })

    return points
  })

  fastify.post('/upload', {
    preHandler: async (request, reply) => {
      return request.jwtVerify()
    }
  }, async (request, reply) => {
    const Point = await fastify.mongo.model('Point')
    const body = request.body
    const fileData = await csvtojson({ delimiter: ',' }).fromString((body.file) ? Buffer.from(body.file, 'base64').toString('ascii') : '')
    for (const fileDataKey in fileData) {
      if (fileData[fileDataKey].lng && fileData[fileDataKey].lat) {
        fileData[fileDataKey].location = {
          type: 'Point',
          coordinates: [fileData[fileDataKey].lng, fileData[fileDataKey].lat]
        }
        fileData[fileDataKey] = new Point(fileData[fileDataKey])
        await fileData[fileDataKey].save()
      }
    }
    return { result: 'ok' }
  })
}

module.exports.autoPrefix = '/api/points'
