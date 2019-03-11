process.env.TESTENV = true

const bcrypt = require('bcrypt')
const User = require('../app/models/user')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
chai.should()

chai.use(chaiHttp)

const user = {
  credentials: {
    email: 'foo@bar.baz',
    password: '12345',
    password_confirmation: '12345'
  }
}

const updatedUser = {
  credentials: {
    email: 'foo@bar.baz',
    password: '54321'
  }
}

const nonMatchingPasswordsUser = {
  credentials: {
    email: 'dont@type.good',
    password: '12345',
    password_confirmation: '54321'
  }
}

let token = 'notrealtoken'

describe('Users', () => {
  beforeEach(done => {
    User.deleteMany({})
      .then(() => bcrypt.hash(user.credentials.password, 10))
      .then(hash => {
        return {
          email: user.credentials.email,
          hashedPassword: hash,
          token
        }
      })
      .then(pojo => User.create(pojo))
      .then(() => done())
      .catch(() => done())
  })

  after(done => {
    User.remove({})
      .then(() => done())
      .catch(() => done())
  })

  describe('POST /sign-up', () => {
    it('should reject users with duplicate emails', done => {
      chai.request(server)
        .post('/sign-up')
        .send(user)
        .end((e, res) => {
          res.should.have.status(422)
          done()
        })
    })

    it('should reject an empty string password', done => {
      chai.request(server)
        .post('/sign-up')
        .send(Object.assign({}, user.credentials, { password: '', password_confirmation: '' }))
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          res.body.should.have.property('name')
          done()
        })
    })

    it('should reject users with non-matching passwords', done => {
      chai.request(server)
        .post('/sign-up')
        .send(nonMatchingPasswordsUser)
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          res.body.should.have.property('name')
          done()
        })
    })

    it('should create a user if params are valid', done => {
      User.remove({})
        .then(() => {
          chai.request(server)
            .post('/sign-up')
            .send(user)
            .end((e, res) => {
              res.should.have.status(201)
              res.should.be.a('object')
              res.body.should.have.property('user')
              res.body.user.should.have.property('email').eql(user.credentials.email)
              done()
            })
        })
        .catch(() => done())
    })
  })

  describe('POST /sign-in', () => {
    it('should return a token when given valid credentials', done => {
      chai.request(server)
        .post('/sign-in')
        .send(user)
        .end((e, res) => {
          res.should.have.status(201)
          res.should.be.a('object')
          res.body.should.have.property('user')
          res.body.user.should.be.a('object')
          res.body.user.should.have.property('token')
          res.body.user.token.should.be.a('string')
          done()
        })
    })

    it('the token should allow you to GET /examples', done => {
      chai.request(server)
        .get('/examples')
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.should.have.property('examples')
          res.body.examples.should.be.a('array')
          done()
        })
    })
  })

  describe('PATCH /change-password', () => {
    const changePwParams = {
      passwords: {
        old: user.credentials.password,
        new: '54321'
      }
    }

    const badChangePwParams = {
      passwords: {
        old: 'WRONG',
        new: '54321'
      }
    }

    it('fails when the wrong password is provided', done => {
      chai.request(server)
        .patch('/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(badChangePwParams)
        .end((e, res) => {
          res.should.have.status(422)
          done()
        })
    })

    it('fails when the new password is an empty string', done => {
      chai.request(server)
        .patch('/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ passwords: { old: '54321', new: '' } })
        .end((e, res) => {
          res.should.have.status(422)
          done()
        })
    })

    it('is successful and changes the password', done => {
      chai.request(server)
        .patch('/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(changePwParams)
        .end((e, res) => {
          res.should.have.status(204)
        })
        .then(() => {
          chai.request(server)
            .post('/sign-in')
            .send(updatedUser)
            .end((e, res) => {
              res.should.have.status(201)
              res.body.user.should.have.property('token')
              res.body.user.token.should.be.a('string')
              done()
            })
        })
    })
  })

  describe('DELETE /sign-out', () => {
    it('returns 204', done => {
      chai.request(server)
        .delete('/sign-out')
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.status.should.eql(204)
          done()
        })
    })
  })
})
