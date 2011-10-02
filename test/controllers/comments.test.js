var tobi    = require('tobi')
  , vows    = require('vows')
  , helper = require('../helper')
  , Post   = require('../../models/post').Post
  , Tag    = require('../../models/tag').Tag
  , User   = require('../../models/user').User;

var browser = tobi.createBrowser(3030, 'localhost');


vows.describe('controllers.comments').addBatch({
  'POST /comments/create': {
    topic: function () {
      var self = this;

      helper.readyServer(function () {
        helper.initDB(function () {
          helper.signin(function (user) {
            var post = new Post({ title: 'hello', user: user });

            post.save(function (err) {
              var body = JSON.stringify({ body: 'hello', post_id: post._id, user: post.user })
                , headers = { 'Content-Type': 'application/json' };

              browser.post('/comments/create', { body: body, headers: headers }, self.callback);
            });
          });
        });
      });
    },
    'should success': function (res, $) {
      res.should.have.status(200);
    }
  }
}).export(module);
