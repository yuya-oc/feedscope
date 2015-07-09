'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedSchema = new Schema({
  name: String,
  url: String,
  subscriber: Schema.Types.ObjectId
});

/**
 * Validations
 */

// Validate empty name
FeedSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');

// Validate empty url
FeedSchema
  .path('url')
  .validate(function(url) {
    return url.length;
  }, 'URL cannot be blank');

// Validate empty subscriber
FeedSchema
  .path('subscriber')
  .validate(function(subscriber) {
    return (subscriber != null);
  }, 'Subscriber cannot be blank');

// Validate url is not taken by the subscriber
FeedSchema
  .path('url')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({url: value, subscriber: this.subscriber}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified url is already subscribed.');

module.exports = mongoose.model('Feed', FeedSchema);
