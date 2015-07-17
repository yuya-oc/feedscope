'use strict';

var request = require('supertest');

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
          return request(app).get(path)
            .set('Authorization', 'Bearer ' + token);
        });
    },
    post: function(user, path) {
      return login(user)
        .then(function(token) {
          return request(app).post(path)
            .set('Authorization', 'Bearer ' + token);
        });
    }
  }
};
