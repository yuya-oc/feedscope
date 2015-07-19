'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  read: Boolean,
  sourceFeed: {
    type: Schema.Types.ObjectId,
    required: true
  },
  subscriber: {
    type: Schema.Types.ObjectId,
    required: true
  },
  title: String,
  description: String,
  summary: String,
  link: String,
  guid: String
});

module.exports = mongoose.model('Article', ArticleSchema);
