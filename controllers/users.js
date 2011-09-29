var UserForm = require('../forms/user')
  , Tag  = require('../models/tag').Tag
  , User = require('../models/user').User
  , middleware = require('../utils/middleware');

var blockSigninUser = middleware.blockSigninUser
  , loadUser        = middleware.loadUser;


module.exports = function (app) {
  app.get('/', loadUser, function (req, res) {
    res.render('users/home', {
        title: 'Anoside'
      , user: req.user
    });
  });

  app.get('/signup', blockSigninUser, function (req, res) {
    res.render('users/signup', {
        title: 'ユーザ登録'
      , user: null
    });
  });

  app.post('/users/create', UserForm.signup, function (req, res) {
    if (req.form.isValid) {
      User.signup(req.form, function (errs, user) {
        if (errs) {
          res.send({ errors: errs }, 403);
        } else {
          req.session.user_id = user._id;
          res.send();
        }
      });
    } else {
      res.send({ errors: req.form.errors }, 403);
    }
  });

  app.get('/explore', loadUser, function (req, res) {
    Tag.find({}).desc('posts_count').run(function (err, tags) {
      res.render('users/explore', {
          title: 'Explore'
        , user: req.user
        , tags: tags
      });
    });
  });
};
