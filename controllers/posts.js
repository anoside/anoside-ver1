var PostForm   = require('../forms/post')
  , Post       = require('../models/post').Post
  , middleware = require('../utils/middleware')
  , string     = require('../utils/string');

var loadUser = middleware.loadUser
  , splitPost = string.splitPost;


module.exports = function (app) {

  /**
   * つぶやきの投稿
   */

  app.post('/posts/create', loadUser, PostForm.create, function (req, res) {
    if (req.form.isValid) {
      var postAry = splitPost(req.form.post)
        , data = {
              title: postAry[0]
            , body: postAry[1]
            , user: req.user
          };

      Post.create(data, function (err, post) {
        if (err) {
          res.send({ errors: [err] }, 403);
        } else {
          res.send({ post: post });
        }
      });
    } else {
      res.send({ errors: req.form.errors }, 403);
    }
  });

  /**
   * 最新の20件を返す
   */

  app.get('/posts', function (req, res) {
    Post.find({}).desc('created_at').limit(20).run(function (err, posts) {
      res.send(posts);
    });
  });

  /**
   * 指定したタグが付いているポストを返す
   */

  app.get('/posts/tags/:name', function (req, res) {
    Tag.findOne({ name: req.params.name }, function (err, tag) {
      PostTag.find({ tag: tag._id }).desc('created_at').populate('post').run(function (err, docs) {
        var posts = docs.map(function (post) { return post.post });
        res.send(posts);
      });
    });
  });

  /**
   * 指定したポストを表示
   */

  app.get('/posts/:id', loadUser, function (req, res) {
    Post.findById(req.params.id, function (err, post) {
      res.render('posts/show', {
          title: post.title
        , user: req.user
        , post: post
        , csrfToken: req.session._csrf
      });
    });
  });

  /**
   * 指定したポストのコメントを取得
   */

  app.get('/posts/:id/comments', function (req, res) {
    Post.findById(req.params.id).populate('comments').run(function (err, post) {
      res.send(post.comments);
    });
  });
};
