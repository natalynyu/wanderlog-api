const express = require('express')
const passport = require('passport')

const Itinerary = require('../models/itinerary')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// CREATE
router.post('/create-itinerary', requireToken, (req, res, next) => {
  req.body.itinerary.owner = req.user.id
  Itinerary.create(req.body.itinerary)
    .then(itinerary => {
      res.status(201).json({ itinerary: itinerary.toObject() })
    })
    .catch(next)
})

// INDEX - ALL
router.get('/itineraries', requireToken, (req, res, next) => {
  Itinerary.find()
    .then(itineraries => {
      return itineraries.map(itinerary => itinerary.toObject())
    })
    .then(itineraries => res.status(200).json({ itineraries: itineraries }))
    .catch(next)
})

// SHOW ONE
router.get('/itineraries/:id', requireToken, (req, res, next) => {
  Itinerary.findById(req.params.id)
    .then(handle404)
    .then(itinerary => res.status(200).json({ itinerary: itinerary.toObject() }))
    .catch(next)
})

// UPDATE
// PATCH /itineraries/3
router.patch('/itineraries/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.itinerary.owner

  Itinerary.findById(req.params.id).exec()
    .then(handle404)
    .then(itinerary => {
      requireOwnership(req, itinerary)
      for (const key in req.body.itinerary) {
        itinerary[key] = req.body.itinerary[key]
      }
      return itinerary.save()
    })
    .then(itinerary => res.status(200).json({ itinerary: itinerary.toObject() }))
    .catch(next)
})

// DESTROY
// DELETE /itineraries/2
router.delete('/itineraries/:id', requireToken, (req, res, next) => {
  Itinerary.findById(req.params.id)
    .then(handle404)
    .then(itinerary => {
      requireOwnership(req, itinerary)
      itinerary.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
