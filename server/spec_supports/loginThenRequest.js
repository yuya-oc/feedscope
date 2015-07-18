'use strict';

var request = require('supertest');

var setAuthToken = function(request, token) {
  return request.set('Authorization', 'Bearer ' + token);
};

module.exports = function(app) {
  var login = function(user) {
    return new Promise(function(resolve, reject) {
      request(app).post('/auth/local')
        .send(user)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            reject(err);
            return;
          }
          resolve(res.body.token);
        });
    });
  };

  return {
    get: function(user, path) {
      return login(user)
        .then(function(token) {
          return setAuthToken(request(app).get(path), token);
        });
    },
    post: function(user, path) {
      return login(user)
        .then(function(token) {
          return setAuthToken(request(app).post(path), token);
        });
    },
    put: function(user, path) {
      return login(user)
        .then(function(token) {
          return setAuthToken(request(app).put(path), token);
        });
    },
    patch: function(user, path) {
      return login(user)
        .then(function(token) {
          return setAuthToken(request(app).patch(path), token);
        });
    },
    delete: function(user, path) {
      return login(user)
        .then(function(token) {
          return setAuthToken(request(app).delete(path), token);
        });
    }
  }
};
