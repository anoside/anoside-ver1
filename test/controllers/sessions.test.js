var tobi    = require('tobi')
  , vows    = require('vows')
  , helper = require('../helper');

var browser = tobi.createBrowser(3030, 'localhost');


vows.describe('controllers.sessions').addBatch({
  'GET /signin': {
    topic: function () {
      var self = this;

      helper.readyServer(function () {
        browser.get('/signin', self.callback);
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    }
  },

  'POST /sessions/create': {
    topic: function () {
      var self = this
        , body = JSON.stringify({ signinid: 'bojovs1', password: 'hoge' })
        , headers = { 'Content-Type': 'application/json' };

      helper.readyServer(function () {
        helper.initDB(function () {
          browser.post('/users/create', { body: body, headers: headers }, function (res, $) {
            browser.post('/sessions/create', { body: body, headers: headers }, self.callback);
          });
        });
      });
    },
    'should success': function (res, $) {
      res.should.have.status(204);
    }
  },

  'GET /signout': {
    topic: function () {
      var self = this
        , body = JSON.stringify({ signinid: 'bojovs2', password: 'hoge' })
        , headers = { 'Content-Type': 'application/json' };

      helper.readyServer(function () {
        helper.initDB(function () {
          browser.post('/users/create', { body: body, headers: headers }, function (res, $) {
            browser.post('/sessions/create', { body: body, headers: headers }, function (res, $) {
              browser.get('/signout', self.callback);
            });
          });
        });
      });
    },
    'should return response 200': function (res, $) {
      res.should.have.status(200);
    }
  }
}).export(module);
