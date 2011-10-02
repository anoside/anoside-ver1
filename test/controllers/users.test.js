var tobi    = require('tobi')
  , vows    = require('vows')
  , helper = require('../helper');

var browser = tobi.createBrowser(3030, 'localhost');


vows.describe('controllers.users').addBatch({
  'GET /': {
    topic: function () {
      var self = this;

      helper.readyServer(function () {
        browser.get('/', self.callback);
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    }
  },

  'GET /signup': {
    topic: function () {
      var self = this;

      helper.readyServer(function () {
        browser.get('/signup', self.callback);
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    }
  },

  'POST /users/create': {
    topic: function () {
      var self = this;

      helper.readyServer(function () {
        helper.initDB(function () {
          var body = JSON.stringify({ signinid: 'bojovs', password: 'hoge' })
            , headers = { 'Content-Type': 'application/json' };
          browser.post('/users/create', { body: body, headers: headers }, self.callback);
        });
      });
    },
    'should success': function (res, $) {
      res.should.have.status(204);
    }
  },

  'GET /explore': {
    topic: function () {
      var self = this;

      helper.initDB(function () {
        var tag = new Tag({ name: 'hoge' });
        tag.save(function (err) {
          helper.readyServer(function () {
            browser.get('/explore', self.callback);
          });
        });
      });
    },
    'should display the tag': function (res, $) {
      $('ol#tags li a').should.have.text('hoge');
    }
  }
}).export(module);
