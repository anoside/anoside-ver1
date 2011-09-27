var crypto = require('crypto');


exports.getSalt = function (n) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#%^&*()_+'
    , salt = '';
  for (var i = 0; i < n; i++) {
    salt = salt + chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
};

exports.getHexdigest = function (algorithm, salt, rawPassword) {
  var hash = (salt || '') + (rawPassword || '');
  for (var i = 0; i < 100; i++) {
    hash = crypto.createHmac(algorithm, hash).digest('hex');
  }
  return hash;
};

/**
 * 暗号化されたパスワードを返す
 */

exports.getPassword = function (algorithm, rawPassword) {
  var salt = exports.getSalt(10)
    , hexdigest = exports.getHexdigest(algorithm, salt, rawPassword);
  return algorithm + '$' + salt + '$' + hexdigest;
};

exports.checkPassword = function (rawPassword, password) {
  var ary = password.split('$');
  return ary[2] === exports.getHexdigest(ary[0], ary[1], rawPassword);
};
