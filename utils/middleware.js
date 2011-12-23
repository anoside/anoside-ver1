var User = require('../models/user').User;


exports.loadUser = function (req, res, next) {
  User.getById(req.session.user_id, function (user) {
    req.user = user || null;
    next();
  });
};

/**
 * ログインしていないユーザに403を返す
 */

exports.blockNonAuthenticatedUser = function (req, res, next) {
  req.user ? next() : res.send(403);
}

/**
 * ログインしているユーザが見れないよう、rootにリダイレクトする
 */

exports.blockSigninUser = function (req, res, next) {
  exports.loadUser(req, res, function () {
    if (req.user) {
      res.redirect('/');
    } else {
      next();
    }
  });
};
