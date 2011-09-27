var User = require('../models/user').User;


exports.loadUser = function (req, res, next) {
  User.getById(req.session.user_id, function (user) {
    req.user = user || null;
    next();
  });
};

//exports.authorize = function (req, res, next) {
  ////console.log(req.session.user_id);
  //if (!req.user) {
    //userModel.getUserById(req.session.user_id, function (user) {
      //if (user) {
        //req.user = user;
        ////console.log(req.user);
      //} else {
        //res.redirect('/signin');
      //}
      //next();
    //});
  //} else {
    //next();
  //}
//};

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
