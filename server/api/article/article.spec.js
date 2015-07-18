'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

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
});
