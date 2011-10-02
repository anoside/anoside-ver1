var CommentForm = require('../forms/comment')
  , Comment     = require('../models/comment').Comment
  , Post        = require('../models/post').Post
  , middleware  = require('../utils/middleware');

var loadUser = middleware.loadUser;


module.exports = function (app) {

  /**
   * コメントの投稿
   */

  app.post('/comments/create', loadUser, CommentForm.create, function (req, res) {
    if (req.form.isValid) {
      Post.getById(req.form.post_id, function (post) {
        var data = {
                body: req.form.body
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
