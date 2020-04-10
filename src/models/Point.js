const { Schema } = require("mongoose");

module.exports = new Schema({
  name:  {
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
  lat:  {
    type: Number,
    required: true
  },
  lon:  {
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
  }
}, { timestamps: true });
