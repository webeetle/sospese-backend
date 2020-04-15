'use strict'

const fp = require('fastify-plugin')
const mongoosePlugin = require('fastify-mongoose-driver').plugin
const fs = require('fs')
const path = require('path')

const MODELS_DIR = path.join(__dirname, '..', 'models')

module.exports = fp(async function (fastify, opts) {
  const dir = fs.readdirSync(MODELS_DIR)
  const files = []

  for (const file of dir) {
    const model = require(`${path.join(MODELS_DIR, file)}`)
    files.push({
      name: path.parse(file).name,
      schema: model
    })
  }

  const mongooseOpts = {
    uri: process.env.MONGO,
    settings: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  }

  fastify.register(mongoosePlugin, mongooseOpts)
})
