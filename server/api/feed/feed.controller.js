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
  }, function(err, things) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, things);
  });
};

// Get a single feed
exports.show = function(req, res) {
  Feed.findById(req.params.id, function(err, thing) {
    if (err) {
      return handleError(res, err);
    }
    if (!thing) {
      return res.send(404);
    }
    return res.json(thing);
  });
};

// Creates a new feed in the DB.
exports.create = function(req, res) {
  req.body.subscriber = req.user._id;
  Feed.create(req.body, function(err, thing) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, thing);
  });
};

// Updates an existing feed in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Feed.findById(req.params.id, function(err, thing) {
    if (err) {
      return handleError(res, err);
    }
    if (!thing) {
      return res.send(404);
    }
    var updated = _.merge(thing, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Feed.findById(req.params.id, function(err, thing) {
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
