var User = require('../models/user').User;


exports.loadUser = function (req, res, next) {
  User.getById(req.session.user_id, function (user) {
    req.user = user || null;
    next();
  });
};

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
