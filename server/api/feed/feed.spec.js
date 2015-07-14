'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Feed = require('./feed.model');
var auth = require('../../auth/auth.service.js');

var user_data = {
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
};

var user_data_2 = {
  provider: 'local',
  name: 'Fake User 2',
  email: 'test2@test.com',
  password: 'password'
};

var feed_data = {
  name: 'Test feed',
  url: 'http://test.com/feed'
};

var user = new User(user_data);
var user2 = new User(user_data_2);
var feed = new Feed(feed_data);
feed.subscriber = user._id;

describe('GET /api/feeds', function() {

  beforeEach(function(done) {
    // Clear users and feeds before testing
    User.remove().exec()
      .then(function() {
        return User.create([user, user2]);
      })
      .then(function() {
        return Feed.remove().exec();
      })
      .then(function() {
        return Feed.create(feed);
      })
      .then(function() {
        done();
      });
  });

  afterEach(function(done) {
    User.remove().exec()
      .then(function() {
        return Feed.remove().exec();
      })
      .then(function() {
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
    request(app)
      .post('/auth/local')
      .send({
        email: user_data.email,
        password: user_data.password
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        request(app)
          .get('/api/feeds')
          .set('Authorization', 'Bearer ' + res.body.token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.forEach(function(item) {
              item.subscriber.should.equal(user._id.toString());
            });
            done();
          });
      });
  });

  it('should not respond any feeds subscribed by other users', function(done) {
    request(app)
      .post('/auth/local')
      .send({
        email: user_data_2.email,
        password: user_data_2.password
      })
      .expect(200)
      .end(function(err, res) {
        request(app)
          .get('/api/feeds')
          .set('Authorization', 'Bearer ' + res.body.token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.forEach(function(item) {
              item.subscriber.should.notEqual(user._id.toString());
            });
            done();
          });
      });
  });
});
