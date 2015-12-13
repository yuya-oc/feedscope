'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var _ = require('lodash');
var async = require('async');

var FeedParser = require('feedparser');
var request = require('request');

var mongoose = require('mongoose');
var config = require('../server/config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

var Article = require('../server/api/article/article.model');
var Feed = require('../server/api/feed/feed.model');

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

var fetchArticles = function(feedUrl) {
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

var genNewArticleDoc = function(article, feed) {
  var newArticle = new Article(article);
  newArticle.subscriber = feed.subscriber;
  newArticle.sourceFeed = feed._id;
  return newArticle;
};

var mergeWithDB = function(feed, newArticles) {
  return Article.find({
      sourceFeed: feed._id
    }).exec()
    .then(function(articles) {
      if (articles.length === 0) {
        return newArticles.map(function(article) {
          return genNewArticleDoc(article, feed);
        });
      }
      return newArticles.map(function(newArticle) {
        var index = articles.findIndex(function(article) {
          return article.link === newArticle.link;
        });
        if (index != -1) {
          return _.merge(articles[index], newArticle);
        }
        else {
          return genNewArticleDoc(newArticle, feed);
        }
      });
    })
    .then(function(articles) {
      return new Promise(function(resolve, reject) {
        async.each(articles, function(article, callback) {
          console.log('[save] ' + article.link);
          article.save(function(err) {
            if (err) console.log(err);
            callback();
          });
        }, function(err) {
          resolve();
        });
      });
    });
}

Feed.find().exec()
  .then(function(feeds) {
    return new Promise(function(resolve, reject) {
      async.each(feeds, function(feed, callback) {
        console.log(feed.url);
        fetchArticles(feed.url)
          .then(function(items) {
            return mergeWithDB(feed, items);
          })
          .then(function() {
            console.log('[done]' + feed.url);
            callback();
          });
      }, function(err) {
        resolve();
      });
    });
  })
  .then(function() {
    mongoose.disconnect();
  });
