'use strict'

const fp = require('fastify-plugin')
module.exports = fp(async function (fastify, opts) {
  const pointSchema = {}
  const nearSchema = {}

  Object.assign(pointSchema, {
    $id: '#point',
    properties: {}
  })

  Object.assign(nearSchema, {
    $id: '#near',
    properties: {
      ...nearSchema.properties,
      dist: {
        type: 'object',
        properties: {
          calculated: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              type: { type: 'string' }
            }
          }
        }
      }
    }
  })

  fastify.addSchema(pointSchema)
  fastify.addSchema(nearSchema)
})
