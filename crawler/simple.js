'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var FeedParser = require('feedparser');
var request = require('request');

var mongoose = require('mongoose');
var config = require('../server/config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

var Article = require('../server/api/article/article.model');
var Feed = require('../server/api/feed/feed.model');

var fetchPromise = function(feedUrl) {
  return new Promise(function(resolve, reject) {
    var req = request(feedUrl);
    var feedparser = new FeedParser([{
      feedurl: true
    }]);
    var items = [];

    req.on('error', function(error) {
      // handle any request errors
      console.log(error);
      reject(error);
    });
    req.on('response', function(res) {
      var stream = this;
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
      stream.pipe(feedparser);
    });

    feedparser.on('error', function(error) {
      // always handle errors
      console.log(error);
      reject(error);
    });
    feedparser.on('readable', function() {
      // This is where the action is!
      var stream = this;
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      var item;

      while (item = stream.read()) {
        items.push(item);
      }
    });
    feedparser.on('end', function() {
      resolve(items);
    });
  });
};

Feed.find().exec()
  .then(function(feeds) {
    feeds.forEach(function(feed) {
      console.log(feed.url);
      fetchPromise(feed.url)
        .then(function(items) {
          items.forEach(function(item) {
            console.log(item.link);
          });
        });
    });
  })
  .then(function() {
    mongoose.disconnect();
  });
