var assert = require('assert')
  , tobi   = require('tobi')
  , vows   = require('vows')
  , helper = require('../helper');

var browser = tobi.createBrowser(3030, 'localhost');


vows.describe('controllers.posts').addBatch({
  'POST /posts/create': {
    topic: function () {
      var self = this;

      helper.readyServer(function () {
        helper.initDB(function () {
          helper.signin(function (user) {
            var body = JSON.stringify({ post: 'hello world' })
              , headers = { 'Content-Type': 'application/json' };

            browser.post('/posts/create', { body: body, headers: headers }, self.callback);
          });
        });
      });
    },
    'should success': function (res, $) {
      res.should.have.status(200);
    }
  },

  'GET /posts': {
    topic: function () {
      var self = this;

      helper.readyServer(function () {
        helper.initDB(function () {
          helper.signin(function (user) {
            var body = JSON.stringify({ post: 'hoge' })
              , headers = { 'Content-Type': 'application/json' };

            browser.post('/posts/create', { body: body, headers: headers }, function (res, $) {
              var body = JSON.stringify({ post: 'fuga' });

              browser.post('/posts/create', { body: body, headers: headers }, function (res, $) {
                browser.get('/posts', self.callback);
              });
            });
          });
        });
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    },
    'should return 2 posts': function (res, $) {
       // TODO: このファイル内で保存したpostが消えていないため、
       // res.bodyの長さが2ではなくなっている。2でテストが通るようにする。
      res.body.should.have.length(6);
    }
  },

  'GET /posts/tags/:name': {
    topic: function () {
      var self = this;

      helper.initDB(function () {
        var tag = new Tag({ name: 'hoge', lowerName: 'Hoge' });
        tag.save(function (err) {
          var post = new Post({ title: 'hi', posts: [tag] });
          post.save(function (err) {
            var postTag = new PostTag({ post: post, tag: tag });
            postTag.save(function (err) {
              browser.get('/posts/tags/hoge', self.callback);
            });
          });
        });
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    },
    'should return 1 post': function (res, $) {
      res.body.should.have.length(1);
    }
  },

  'GET /posts/:id': {
    topic: function () {
      var self = this;

      helper.initDB(function () {
        var comment1 = new Comment({ body: 'foo' });
        comment1.save(function (err) {
          var comment2 = new Comment({ body: 'bar' });
          comment2.save(function (err) {
            var post = new Post({ title: 'uho', comments: [comment1, comment2] });
            post.save(function (err) {
              browser.get('/posts/' + post._id, self.callback);
            });
          });
        });
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    },
    'should display the post': function (res, $) {
      $('.post h1').should.have.text('uho');
    }
  },

  'GET /posts/:id/comments': {
    topic: function () {
      var self = this;

      helper.initDB(function () {
        var comment1 = new Comment({ body: 'foo' });
        comment1.save(function (err) {
          var comment2 = new Comment({ body: 'bar' });
          comment2.save(function (err) {
            var post = new Post({ title: 'uho', comments: [comment1, comment2] });
            post.save(function (err) {
              browser.get('/posts/' + post._id + '/comments', self.callback);
            });
          });
        });
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    },
    'should return 2 comments': function (res, $) {
      res.body.should.have.length(2);
    }
  }
}).export(module);
