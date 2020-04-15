'use strict'

const csvtojson = require('csvtojson/v2')
const S = require('fluent-schema')

module.exports = async (fastify, opts) => {
  const pointsCollection = fastify.mongo.db.collection('points')
  const { ObjectId } = fastify.mongo

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
    var points = await pointsCollection.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [request.body.lng, request.body.lat] },
          distanceField: 'dist.calculated',
          maxDistance: request.body.distance,
          includeLocs: 'dist.location',
          spherical: true
        }
      },
      {
        $addFields: {
          thumbsUp: {
            $size: {
              $filter: {
                input: { $ifNull: ['$votes', []] },
                as: 'vote',
                cond: { $eq: ['$$vote.type', 'up'] }
              }
            }
          },
          thumbsDown: {
            $size: {
              $filter: {
                input: { $ifNull: ['$votes', []] },
                as: 'vote',
                cond: { $eq: ['$$vote.type', 'down'] }
              }
            }
          },
          thumbsDownVotes: {
            $filter: {
              input: { $ifNull: ['$votes', []] },
              as: 'vote',
              cond: { $eq: ['$$vote.type', 'down'] }
            }
          }
        }
      }
    ]).sort({ 'dist.calculated': 1 }).toArray()
    return points
  })

  fastify.post('/upload', async (request, reply) => {
    const body = request.body
    const fileData = await csvtojson({ delimiter: ',' }).fromString((body.file) ? Buffer.from(body.file, 'base64').toString('ascii') : '')
    for (const fileDataKey in fileData) {
      if (fileData[fileDataKey].lng && fileData[fileDataKey].lat) {
        fileData[fileDataKey].location = {
          type: 'Point',
          coordinates: [Number(fileData[fileDataKey].lng), Number(fileData[fileDataKey].lat)]
        }
        fileData[fileDataKey].votes = []
        await pointsCollection.insertOne(fileData[fileDataKey])
      }
    }
    return { result: 'ok' }
  })

  fastify.post('/report', async (request, reply) => {
    const body = request.body
    body.location = {
      type: 'Point',
      coordinates: [body.lng, body.lat]
    }
    body.votes = []
    body.reportedFromComunity = true
    try {
      const res = await pointsCollection.insertOne(body)
      return res.ops[0]
    } catch (e) {
      reply.status(500)
      return { error: 'Unable To Create This Point' }
    }
  })

  fastify.post('/vote/:id', async (request, reply) => {
    const id = request.params.id
    const body = request.body
    try {
      const res = await pointsCollection.findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          $push: {
            votes: { type: body.type, message: body.message }
          }
        },
        {
          returnOriginal: false
        }
      )
      return res.value
    } catch (e) {
      reply.status(404)
      return { error: e.message }
    }
  })
}

module.exports.autoPrefix = '/api/points'
