var crypto = require('crypto');

/**
 * ユーザごとのIDを生成する
 */

exports.generateIdentityId = function (user, post) {
  var userId = user.id
    , postId = post.id
    , id = crypto.createHmac('sha256', userId + postId).digest('base64');

  return id.slice(0, 10);
};
