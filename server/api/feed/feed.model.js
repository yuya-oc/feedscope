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

module.exports = mongoose.model('Feed', FeedSchema);
