var tobi    = require('tobi')
  , vows    = require('vows')
  , helper = require('../helper');

var browser = tobi.createBrowser(3030, 'localhost');


vows.describe('controllers.sessions').addBatch({
  'POST /tags/create': {
    topic: function () {
      var self = this
        , body = JSON.stringify({ signinid: 'bojovs1', password: 'hoge' })
        , headers = { 'Content-Type': 'application/json' };

      helper.readyServer(function () {
        helper.initDB(function () {
          browser.post('/users/create', { body: body, headers: headers }, function (res, $) {
            browser.post('/sessions/create', { body: body, headers: headers }, function (res, $) {
              var post = new Post({ title: 'hello' });

              post.save(function (err) {
                var body = JSON.stringify({ name: 'tag1', post_id: post._id });

                browser.post('/tags/create', { body: body, headers: headers }, self.callback);
              });
            });
          });
        });
      });
    },
    'should success': function (res, $) {
      res.should.have.status(200);
    },
    'should return the tag': function (res, $) {
      res.body.tag.name.should.equal('tag1');
    }
  },

  'GET /t/:name': {
    topic: function () {
      var self = this;

      helper.readyServer(function () {
        helper.initDB(function () {
          var post = new Post({ title: 'hellohello' });
          post.save(function (err) {
            var tag = new Tag({ name: 'tag1', lowerName: 'Tag1', post_id: post._id });
            
            tag.save(function (err) {
              browser.get('/t/tag1', self.callback);
            });
          });
        });
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    },
    'should display a tag name': function (res, $) {
      $('h1').should.have.text('タグ: tag1');
    }
  }
}).export(module);
