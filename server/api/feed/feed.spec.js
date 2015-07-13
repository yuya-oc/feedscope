'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var auth = require('../../auth/auth.service.js');

var user_data = {
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
};

var user = new User(user_data);

describe('GET /api/feeds', function() {

  before(function(done) {
    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should not respond without authentication', function(done) {
    request(app)
      .get('/api/feeds')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should respond with JSON array', function(done) {
    User.create(user, function(err, user){
      request(app)
        .post('/auth/local')
        .send({email: user_data.email, password: user_data.password})
        .expect(200)
        .end(function(err, res){
          request(app)
            .get('/api/feeds')
            .set('Authorization', 'Bearer ' + res.body.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              if (err) return done(err);
              res.body.should.be.instanceof(Array);
              done();
            });
        });
    });
  });
});
