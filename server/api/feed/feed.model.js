'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FeedSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  subscriber: {
    type: Schema.Types.ObjectId,
    required: true
  },
  tags: [Schema.Types.ObjectId]
});

/**
 * Validations
 */

// Validate empty name
FeedSchema
  .path('name')
  .validate(function(name) {
    return name && name.length;
  }, 'Name cannot be blank');

// Validate empty url
FeedSchema
  .path('url')
  .validate(function(url) {
    return url && url.length;
  }, 'URL cannot be blank');

// Validate empty subscriber
FeedSchema
  .path('subscriber')
  .validate(function(subscriber) {
    return (subscriber !== null);
  }, 'Subscriber cannot be blank');

// Validate url is not taken by the subscriber
FeedSchema
  .path('url')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({
      url: value,
      subscriber: this.subscriber
    }, function(err, feed) {
      if (err) throw err;
      if (feed) {
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified feed is already subscribed.');

module.exports = mongoose.model('Feed', FeedSchema);
