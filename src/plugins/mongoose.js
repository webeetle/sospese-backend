'use strict'

const fp = require('fastify-plugin')
const mongoose = require('mongoose')
require('mongoose-schema-jsonschema')(mongoose)
require('dotenv').config()

module.exports = fp(async function (fastify, opts) {
  class Mongoose {
    async connection() {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        return true
      } else {
        return 'already connected'
      }
    }

    async model(modelName) {
      await this.connection()
      let modelSchema = require(`${__dirname}/../models/${modelName}.js`)
      return mongoose.model(modelName, modelSchema)
    }

    close() {
      if(mongoose.connection.readyState === 1) {
        mongoose.connection.close()
        return true
      } else {
        return false
      }
    }
  }

  fastify.decorate('mongo', new Mongoose())
}, { name: 'mongoose'})