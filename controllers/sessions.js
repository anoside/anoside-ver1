var middleware = require('../utils/middleware')
  , User = require('../models/user').User
  , UserForm = require('../forms/user');

var blockSigninUser = middleware.blockSigninUser;


module.exports = function (app) {

  /**
   * ログイン画面
   */

  app.get('/signin', blockSigninUser, function (req, res) {
    res.render('sessions/signin', {
      title: 'ログイン',
      user: null
    });
  });

  /**
   * ログイン処理
   */

  app.post('/sessions/create', UserForm.signin, function (req, res) {
    var errorMassage = 'ログインIDかパスワードが間違っています';

    if (req.form.isValid) {
      User.signin(req.form, function (user) {
        if (user) {
          req.session.user_id = user._id;
          res.send();
        } else {
          res.send({ errors: [errorMassage] }, 403);
        }
      });
    } else {
      res.send({ errors: [errorMassage] }, 403);
    }
  });
  
  /**
   * ログアウト処理
   */

  app.get('/signout', function (req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });
};
