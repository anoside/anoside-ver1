var assert = require('assert')
  , vows   = require('vows')
  , helper = require('../helper');


vows.describe('models.user').addBatch({
  '.signin': {
    topic: function () {
      var self = this;

      helper.initDB(function () {
        var userData = { signinid: 'bojovs', password: 'pass' };

        User.signup(userData, function (err, user) {
          User.signin(userData, function (user) {
            // TODO: よくわからないけど、ここでself.callback関数の第一引数に
            // nullを渡さないと"An unexpected error was caught"と言われ、エラーになる。
            // 参考: http://japhr.blogspot.com/2010/07/asynchronous-testing-of-fabjs-with.html
            // User.signin(userData, self.callback); と書いて何がいけないのかを調べる。
            self.callback(null, user);
          });
        });
      });
    },
    'should return the user': function (user) {
      assert.equal(user.signinid, 'bojovs');
    }
  },

  '.signup': {
    topic: function () {
      var self = this;

      helper.initDB(function () {
        var userData = { signinid: 'bojovs', password: 'pass' };

        User.signup(userData, function (err, user) {
          User.find({}, self.callback);
        });
      });
    },
    'should return the user': function (err, users) {
      assert.length(users, 1);
    }
  }
}).export(module);
