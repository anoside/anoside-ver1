var sanitize = require('validator').sanitize;


/**
 * ポストの一行目と残りを返す
 */

exports.splitPost = function (post) {
  var ary = post.split(/\n/)
    , title = ary.shift()
    , body = sanitize(ary.join('\n')).trim();
  return [title, body];
};
