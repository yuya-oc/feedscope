'use strict';

var _ = require('lodash');
var Article = require('./article.model');

// Get list of articles
exports.index = function(req, res) {
  Article.find({
    subscriber: req.user._id
  }, function(err, articles) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, articles);
  });
};

// Get a single article
exports.show = function(req, res) {
  Article.findOne({
    _id: req.params.id,
    subscriber: req.user._id
  }, function(err, article) {
    if (err) {
      return handleError(res, err);
    }
    if (!article) {
      return res.send(404);
    }
    return res.json(article);
  });
};

// Updates an existing article in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Article.findOne({
    _id: req.params.id,
    subscriber: req.user._id
  }, function(err, article) {
    if (err) {
      return handleError(res, err);
    }
    if (!article) {
      return res.send(404);
    }
    var updated = _.merge(article, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, article);
    });
  });
};

// Get list of articles filtered by feed id
exports.indexByFeed = function(req, res) {
  Article.find({
    sourceFeed: req.params.id,
    subscriber: req.user._id
  }, function(err, articles) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, articles);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
