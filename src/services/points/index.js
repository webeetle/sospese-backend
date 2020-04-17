'use strict'

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
          totalDonations: {
            $size: { $ifNull: ['$donations', []] }
          }
        }
      },
      { $project: { votes: 0, donations: 0 } }
    ]).sort({ 'dist.calculated': 1 }).toArray()
    return points
  })

  fastify.post('/report', async (request, reply) => {
    const body = request.body
    body.location = {
      type: 'Point',
      coordinates: [body.lng, body.lat]
    }
    body.votes = []
    body.donations = []
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
      await pointsCollection.findOneAndUpdate(
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
      return { message: 'ok' }
    } catch (e) {
      reply.status(404)
      return { error: e.message }
    }
  })

  fastify.post('/donation/:id', async (request, reply) => {
    const id = request.params.id
    const body = request.body
    try {
      await pointsCollection.findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          $push: {
            donations: { name: (body.name) ? body.name : 'anonimo', message: body.message }
          }
        },
        {
          returnOriginal: false
        }
      )
      return { message: 'ok' }
    } catch (e) {
      reply.status(404)
      return { error: e.message }
    }
  })

  fastify.get('/stats', async (request, reply) => {
    var stats = await pointsCollection.aggregate([
      { $addFields: { totalDonations: { $size: { $ifNull: ['$donations', []] } } } },
      { $group: { _id: null, donations: { $sum: '$totalDonations' }, points: { $sum: 1 } } },
      { $project: { _id: 0 } }
    ]).toArray()
    return stats[0]
  })

  fastify.get('/:id', async (request, reply) => {
    const id = request.params.id
    try {
      var point = await pointsCollection.aggregate([
        {
          $match: { _id: ObjectId(id) }
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
            totalDonations: { $size: { $ifNull: ['$donations', []] } }
          }
        },
        {
          $project: { votes: 0, donations: 0 }
        }
      ]).toArray()
      return point[0]
    } catch (e) {
      reply.status(404)
      return { error: e.message }
    }
  })
}

module.exports.autoPrefix = '/api/points'
