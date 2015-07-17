'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Feed = require('./feed.model');
var loginThenRequest = require('../../spec_supports/loginThenRequest.js');

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

var setupDatabase = function(done) {
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
}

var teardownDatabase = function(done) {
  User.remove().exec()
    .then(function() {
      return Feed.remove().exec();
    })
    .then(function() {
      done();
    });
}

describe('GET /api/feeds', function() {

  beforeEach(function(done) {
    setupDatabase(done);
  });

  afterEach(function(done) {
    teardownDatabase(done);
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
    loginThenRequest(app).get(user_data, '/api/feeds')
      .then(function(get) {
        get
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
    loginThenRequest(app).get(user_data_2, '/api/feeds')
      .then(function(get) {
        get
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

describe('GET /api/feeds/:id', function() {

  beforeEach(function(done) {
    setupDatabase(done);
  });

  afterEach(function(done) {
    teardownDatabase(done);
  });

  it('should not respond without authentication', function(done) {
    request(app)
      .get('/api/feeds/' + feed._id)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should respond a feed which have the requested id', function(done) {
    loginThenRequest(app).get(user_data, '/api/feeds/' + feed._id)
      .then(function(get) {
        get
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.be.have.property('name', feed.name);
            res.body.should.be.have.property('url', feed.url);
            res.body.should.be.have.property('tags');
            done();
          });
      });
  });

  it('should not respond a feed which is subscribed by other users', function(done) {
    loginThenRequest(app).get(user_data_2, '/api/feeds/' + feed._id)
      .then(function(get) {
        get
          .expect(404)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
  });

});
