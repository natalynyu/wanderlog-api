const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
})

const ItinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  locations: {
    type: [LocationSchema],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Itinerary', ItinerarySchema)
