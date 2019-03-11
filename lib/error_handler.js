// an error handling middleware that will run anytime one of the route
// handlers calls `next`, in other words, when an error gets thrown in one of
// the promise chains
module.exports = function (err, req, res, next) {
  // LOG ERRORS

  // don't log errors in a test environment
  if (!process.env.TESTENV) {
    // log a rudimentary timestamp
    console.log('\n', new Date().toTimeString() + ':')
    // log the original error the terminal running Express
    console.error(err)
  }

  // HTTP RESPONSES

  // there are `ValidationError`s and `ValidatorErrors`, so use a regex
  // to catch them both
  if (err.name.match(/Valid/) || err.name === 'MongoError') {
    // if the error came from trying to create a user that already exists,
    // the error message will contain a bunch of data about that user.
    // That's a major vulnerability, so we need to send back a custom message
    const message = 'The receieved params failed a Mongoose validation'
    err = { status: 422, message }
  } else if (err.name === 'DocumentNotFoundError') {
    err.status = 404
  } else if (err.name === 'CastError' || err.name === 'BadParamsError') {
    err.status = 422
  } else if (err.name === 'BadCredentialsError') {
    err.status = 401
  }

  // if set a status code above, send that status code
  // otherwise, send 500. Also, send the error message as JSON.
  res.status(err.status || 500).json(err)
}
