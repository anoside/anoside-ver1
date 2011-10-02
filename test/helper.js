var mongoose = require('mongoose')
  , tobi     = require('tobi')
  , app     = require('../app')
  , Comment = require('../models/comment').Comment
  , Post    = require('../models/post').Post
  , PostTag = require('../models/post_tag').PostTag
  , Tag     = require('../models/tag').Tag
  , User    = require('../models/user').User;

var browser = tobi.createBrowser(3030, 'localhost')
  , serverActivity = false
  , models = [Comment, Post, PostTag, Tag, User];


process.on('exit', function () {
  if (serverActivity) {
    app.close();
  }
});


module.exports = {

  /**
   * 配列modelsに入っているドキュメントを全て削除する
   */

  initDB: function initDB(callback, count) {
    var cnt = count || 0;
    models[cnt].remove(function () {
      cnt += 1;
      if (cnt === models.length) {
        callback();
      } else {
        initDB(callback, cnt);
      }
    });
  },

  /**
   * サーバが起動していなかったら起動する
   */

  readyServer: function (callback) {
    if (serverActivity) {
      callback();
    } else {
      serverActivity = true;
      app.listen(3030, function () {
        callback();
      });
    }
    return;
  },

  /**
   * ログイン処理
   */
  
  signin: function (callback) {
    User.signup({ signinid: 'bojovs', password: 'pass' }, function (err, user) {
      var body = JSON.stringify({ signinid: user.signinid, password: user.password })
        , headers = { 'Content-Type': 'application/json' };
      browser.post('/sessions/create', { body: body, headers: headers }, function (res, $) {
        callback(user);
      });
    });
  }
};
