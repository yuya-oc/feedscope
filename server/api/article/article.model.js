'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  read: {
    type: Boolean,
    default: false
  },
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
  guid: String,
  date: Date,
  pubdate: Date
});

module.exports = mongoose.model('Article', ArticleSchema);
