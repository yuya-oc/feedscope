/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /feeds              ->  index
 * POST    /feeds              ->  create
 * GET     /feeds/:id          ->  show
 * PUT     /feeds/:id          ->  update
 * DELETE  /feeds/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Feed = require('./feed.model');

// Get list of feeds
exports.index = function(req, res) {
  Feed.find({
    subscriber: req.user._id
  }, function(err, feeds) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, feeds);
  });
};

// Get a single feed
exports.show = function(req, res) {
  Feed.findOne({
    _id: req.params.id,
    subscriber: req.user._id
  }, function(err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.send(404);
    }
    return res.json(feed);
  });
};

// Creates a new feed in the DB.
exports.create = function(req, res) {
  req.body.subscriber = req.user._id;
  Feed.create(req.body, function(err, feed) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, feed);
  });
};

// Updates an existing feed in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Feed.findById(req.params.id, function(err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.send(404);
    }
    if (feed.subscriber.toString() != req.user._id) {
      return res.send(404);
    }
    var updated = _.merge(feed, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, feed);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Feed.findOne({
    _id: req.params.id,
    subscriber: req.user._id
  }, function(err, thing) {
    if (err) {
      return handleError(res, err);
    }
    if (!thing) {
      return res.send(404);
    }
    thing.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
