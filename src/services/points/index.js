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
        .prop('200', S.array().items(S.object(S.ref('#near'))))
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

  fastify.post('/report', async (request, reply) => {
    const Point = await fastify.mongo.model('Point')
    const body = request.body
    const newPoint = new Point(body)
    newPoint.location = {
      type: 'Point',
      coordinates: [body.lng, body.lat]
    }
    newPoint.reportedFromComunity = true
    await newPoint.save()
    return newPoint
  })

  // fastify.post('/vote/:id', async(request, reply) => {
  //   const Point = await fastify.mongo.model('Point')
  //   const id = request.params['id']
  //   try {
  //     const point = Point.find({ _id: id })
  //   } catch (e) {
  //     reply.status(404)
  //     return { 'error': 'message' }
  //   }
  // })
}

module.exports.autoPrefix = '/api/points'
