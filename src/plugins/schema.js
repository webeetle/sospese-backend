'use strict'

const fp = require('fastify-plugin')
// const point = require('../models/Point')

module.exports = fp(async function (fastify, opts) {
  /* const pointSchema = await point.jsonSchema()
  const nearSchema = { ...pointSchema }

  Object.assign(pointSchema, {
    $id: '#point'
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
  fastify.addSchema(nearSchema) */
})
