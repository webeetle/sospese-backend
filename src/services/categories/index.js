'use strict'

module.exports = async (fastify, opts) => {
  const categoriesCollection = fastify.mongo.db.collection('categories')

  fastify.get('/', async (request, reply) => {
    var categories = await categoriesCollection.find({}).toArray()
    return categories
  })
}

module.exports.autoPrefix = '/api/categories'
