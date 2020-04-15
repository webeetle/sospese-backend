'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
  fastify.addHook('onRegister', (istance, opts) => {
    istance.mongo.db.createIndex('points', { location: '2dsphere' }, (err) => {
      if (err) {
        fastify.log.error('Unable To Create Mongo Index For GeoQuery')
        fastify.close()
      }
    })
  })
}, { name: 'onRegister' })
