'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var Article = require('./article.model');
var User = require('../user/user.model');
var Feed = require('../feed/feed.model');
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

var feed_data_2 = {
  name: 'Test feed 2',
  url: 'http://test.com/feed2'
};

var article_data = {
  title: 'Article 1',
  link: 'http://feed/article',
};

var article_data_2 = {
  title: 'Article 1',
  link: 'http://feed/article'
};

var user = new User(user_data);
var user2 = new User(user_data_2);
var feed = new Feed(feed_data);
var article = new Article(article_data);
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
      return Article.remove().exec();
    })
    .then(function() {
      article.subscriber = user._id;
      article.sourceFeed = feed._id;
      return Article.create(article);
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
      return Article.remove().exec();
    })
    .then(function() {
      done();
    });
}

describe('/api/articles', function() {

  beforeEach(function(done) {
    setupDatabase(done);
  });

  afterEach(function(done) {
    teardownDatabase(done);
  });

  describe('GET /api/articles', function() {
    it('should respond 401 when not logged in', function(done) {
      request(app)
        .get('/api/articles')
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should respond with JSON array', function(done) {
      loginThenRequest(app).get(user_data, '/api/articles')
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

    it('should respond articles which is subscribed other users', function(done) {
      loginThenRequest(app).get(user_data_2, '/api/articles')
        .then(function(get) {
          get
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              if (err) return done(err);
              res.body.should.be.instanceof(Array);
              res.body.forEach(function(item) {
                item.subscriber.should.equal(user2._id.toString());
              });
              done();
            });
        });
    });

  });

  describe('GET /api/articles/:id', function() {
    it('should respond 401 when not logged in', function(done) {
      request(app)
        .get('/api/articles/' + article._id)
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should respond with JSON', function(done) {
      loginThenRequest(app).get(user_data, '/api/articles/' + article._id)
        .then(function(get) {
          get
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              if (err) return done(err);
              res.body._id.should.equal(article._id.toString());
              done();
            });
        });
    });

    it('should respond 404 when not logged in', function(done) {
      loginThenRequest(app).get(user_data_2, '/api/articles/' + article._id)
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

  describe('PUT /api/articles/:id', function() {
    it('should respond 401 when not logged in', function(done) {
      request(app)
        .put('/api/articles/' + article._id)
        .send({
          title: 'New article name',
        })
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          Article.findById(article._id, function(err, updated) {
            if (err) return done(err);
            updated.title.should.not.equal('New article name');
            done();
          });
        });
    });

    it('should respond the updated article', function(done) {
      loginThenRequest(app).put(user_data, '/api/articles/' + article._id)
        .then(function(put) {
          put.send({
              title: 'New article name',
            })
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              res.body.title.should.equal('New article name');
              Article.findById(article._id, function(err, updated) {
                if (err) return done(err);
                updated.title.should.equal('New article name');
                done();
              });
            });
        });
    });

    it('should not updated the article which is subscribed by other users', function(done) {
      loginThenRequest(app).put(user_data_2, '/api/articles/' + article._id)
        .then(function(put) {
          put.send({
              title: 'New article name',
            })
            .expect(404)
            .end(function(err, res) {
              if (err) return done(err);
              Article.findById(article._id, function(err, updated) {
                if (err) return done(err);
                updated.title.should.not.equal('New article name');
                done();
              });
            });
        });
    });
  });

});
