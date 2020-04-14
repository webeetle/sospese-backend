const { Schema } = require('mongoose')

const Point = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  locationPhotoUrl: {
    type: String
  },
  locationType: {
    type: String,
    required: true
  },
  votes: [
    {
      type: {
        type: String,
        enum: ['up', 'down']
      },
      message: String
    }
  ],
  pointType: [String],
  categoryType: [String],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  reportedFromComunity: Boolean
}, { timestamps: true })

Point.index({ location: '2dsphere' })

module.exports = Point
