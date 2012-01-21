var CommentForm = require('../forms/comment')
  , Comment     = require('../models/comment').Comment
  , Post        = require('../models/post').Post
  , commentUtil = require('../utils/comment')
  , middleware  = require('../utils/middleware');

var blockNAUser = middleware.blockNonAuthenticatedUser
  , loadUser = middleware.loadUser;


module.exports = function (app) {

  /**
   * コメントの投稿
   */

  app.post('/comments/create', loadUser, blockNAUser, CommentForm.create, function (req, res) {
    if (req.form.isValid) {
      Post.getById(req.form.post_id, function (post) {
        var data = {
                body: req.form.body
              , commentNumber: post.comments.length + 1
              , identityId: commentUtil.generateIdentityId(req.user, post)
              , isPostMaster: req.user.id === post.user.toString()
              , byAdmin: req.user.isAdmin
              , post: post
              , user: req.user
            };

        Comment.create(data, function (err, comment) {
          if (err) {
            res.send({ errors: [err] }, 403);
          } else {
            post.comments.push(comment);
            post.save(function (err) {
              res.send({ comment: comment });
            });
          }
        });
      });
    } else {
      res.send({ errors: req.form.errors }, 403);
    }
  });
};
