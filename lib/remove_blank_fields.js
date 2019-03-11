// this is a middleware for removing any key/value pairs from `req.body.foo`
// that have an empty string as a value, e.g.
// { example: { title: 'thing', text: '' } } -> { example: { title: 'thing' } }
module.exports = function (req, res, next) {
  // we don't know the name of the object in `req.body`, so we'll apply this to
  // ALL objects in `req.body`
  Object.values(req.body).forEach(obj => {
    for (const key in obj) {
      if (obj[key] === '') {
        // removes both the key and the value, preventing it from being updated
        delete obj[key]
      }
    }
  })

  // pass `req` and `res` on to the route handler
  next()
}
