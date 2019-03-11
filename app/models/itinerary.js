const mongoose = require('mongoose')

const itinerarySchema = new mongoose.Schema({
  locations: {
    type: [String],
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

module.exports = mongoose.model('Itinerary', itinerarySchema)
