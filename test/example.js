process.env.TESTENV = true

let Example = require('../app/models/example.js')
let User = require('../app/models/user')

const crypto = require('crypto')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
chai.should()

chai.use(chaiHttp)

const token = crypto.randomBytes(16).toString('hex')
let userId
let exampleId

describe('Examples', () => {
  const exampleParams = {
    title: '13 JavaScript tricks WDI instructors don\'t want you to know',
    text: 'You won\'believe number 8!'
  }

  before(done => {
    Example.remove({})
      .then(() => User.create({
        email: 'caleb',
        hashedPassword: '12345',
        token
      }))
      .then(user => {
        userId = user._id
        return user
      })
      .then(() => Example.create(Object.assign(exampleParams, {owner: userId})))
      .then(record => {
        exampleId = record._id
        done()
      })
      .catch(console.error)
  })

  describe('GET /examples', () => {
    it('should get all the examples', done => {
      chai.request(server)
        .get('/examples')
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.examples.should.be.a('array')
          res.body.examples.length.should.be.eql(1)
          done()
        })
    })
  })

  describe('GET /examples/:id', () => {
    it('should get one example', done => {
      chai.request(server)
        .get('/examples/' + exampleId)
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.example.should.be.a('object')
          res.body.example.title.should.eql(exampleParams.title)
          done()
        })
    })
  })

  describe('DELETE /examples/:id', () => {
    let exampleId

    before(done => {
      Example.create(Object.assign(exampleParams, { owner: userId }))
        .then(record => {
          exampleId = record._id
          done()
        })
        .catch(console.error)
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .delete('/examples/' + exampleId)
        .set('Authorization', `Bearer notarealtoken`)
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should be succesful if you own the resource', done => {
      chai.request(server)
        .delete('/examples/' + exampleId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('should return 404 if the resource doesn\'t exist', done => {
      chai.request(server)
        .delete('/examples/' + exampleId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })

  describe('POST /examples', () => {
    it('should not POST an example without a title', done => {
      let noTitle = {
        text: 'Untitled',
        owner: 'fakedID'
      }
      chai.request(server)
        .post('/examples')
        .set('Authorization', `Bearer ${token}`)
        .send({ example: noTitle })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not POST an example without text', done => {
      let noText = {
        title: 'Not a very good example, is it?',
        owner: 'fakeID'
      }
      chai.request(server)
        .post('/examples')
        .set('Authorization', `Bearer ${token}`)
        .send({ example: noText })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not allow a POST from an unauthenticated user', done => {
      chai.request(server)
        .post('/examples')
        .send({ example: exampleParams })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should POST an example with the correct params', done => {
      let validExample = {
        title: 'I ran a shell command. You won\'t believe what happened next!',
        text: 'it was rm -rf / --no-preserve-root'
      }
      chai.request(server)
        .post('/examples')
        .set('Authorization', `Bearer ${token}`)
        .send({ example: validExample })
        .end((e, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('example')
          res.body.example.should.have.property('title')
          res.body.example.title.should.eql(validExample.title)
          done()
        })
    })
  })

  describe('PATCH /examples/:id', () => {
    let exampleId

    const fields = {
      title: 'Find out which HTTP status code is your spirit animal',
      text: 'Take this 4 question quiz to find out!'
    }

    before(async function () {
      const record = await Example.create(Object.assign(exampleParams, { owner: userId }))
      exampleId = record._id
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .patch('/examples/' + exampleId)
        .set('Authorization', `Bearer notarealtoken`)
        .send({ example: fields })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should update fields when PATCHed', done => {
      chai.request(server)
        .patch(`/examples/${exampleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ example: fields })
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('shows the updated resource when fetched with GET', done => {
      chai.request(server)
        .get(`/examples/${exampleId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.example.title.should.eql(fields.title)
          res.body.example.text.should.eql(fields.text)
          done()
        })
    })

    it('doesn\'t overwrite fields with empty strings', done => {
      chai.request(server)
        .patch(`/examples/${exampleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ example: { text: '' } })
        .then(() => {
          chai.request(server)
            .get(`/examples/${exampleId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              console.log(res.body.example.text)
              res.body.example.title.should.eql(fields.title)
              res.body.example.text.should.eql(fields.text)
              done()
            })
        })
    })
  })
})
