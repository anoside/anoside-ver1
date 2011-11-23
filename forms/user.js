var form = require('express-form');

var filter   = form.filter
  , validate = form.validate;


exports.signup = form(
    filter('signinid').trim()
  , validate('signinid').required(null, 'ログインIDは必須です').is('^[a-zA-Z0-9_]+$', 'ログインIDが不正な値です')
  , filter('password').trim()
  , validate('password').required(null, 'パスワードは必須です')
);

exports.signin = form(
    filter('signinid').trim()
  , validate('signinid').required()
  , filter('password').trim()
  , validate('password').required()
);
