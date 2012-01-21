var PostForm   = require('../forms/post')
  , Post       = require('../models/post').Post
  , middleware = require('../utils/middleware')
  , string     = require('../utils/string');

var blockNAUser = middleware.blockNonAuthenticatedUser
  , loadUser = middleware.loadUser
  , splitPost = string.splitPost;


module.exports = function (app) {

  /**
   * つぶやきの投稿
   */

  app.post('/posts/create', loadUser, blockNAUser, PostForm.create, function (req, res) {
    if (req.form.isValid) {
      var postAry = splitPost(req.form.post)
        , data = {
              title: postAry[0]
            , body: postAry[1]
            , byAdmin: req.user.isAdmin
            , user: req.user
          };

      Post.create(data, function (err, post) {
        if (err) {
          res.send({ errors: [err] }, 403);
        } else {
          if (req.form.tagLowerName) { // /t/:tagName からポストしたとき  
            Tag.findOne({ lowerName: req.form.tagLowerName }, function (err, tag) {
              post.addTag(tag, function (err) {
                res.send({ post: post });
              });
            });
          } else {
            res.send({ post: post });
          }
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
    Post.find({}).desc('createdAt').limit(20).run(function (err, posts) {
      res.send(posts);
    });
  });

  /**
   * 指定したタグが付いているポストを返す
   */

  app.get('/posts/tags/:name', function (req, res) {
    var lowerTagName = req.params.name.toLowerCase();

    Tag.findOne({ lowerName: lowerTagName }, function (err, tag) {
      PostTag.find({ tag: tag._id }).desc('createdAt').populate('post').run(function (err, docs) {
        var posts = docs.map(function (post) { return post.post });
        res.send(posts);
      });
    });
  });

  /**
   * 指定したポストを表示
   */

  app.get('/p/:id', loadUser, function (req, res) {
    res.render('posts/show', {
        title: '' // タイトルはクライアントサイドで生成する
      , user: req.user
      , csrfToken: req.session._csrf
    });
  });

  /**
   * 指定したポストとそれへのコメントを取得
   */

  app.get('/posts/:id', function (req, res) {
    Post.findById(req.params.id).populate('comments').run(function (err, post) {
      res.send(post);
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

  /**
   * 指定したポストを削除
   */

  app.delete('/posts/:id', loadUser, function (req, res) {
    Post.findById(req.params.id, function (err, post) {
      if (req.user.isOwns(post)) {
        post.remove(function (err) {
          Comment.remove({ post: post.id }, function () {
            PostTag.remove({ post: post.id }, function () {
              res.send(200);
            });
          });
        });
      } else {
        res.send(400);
      }
    });
  });
};
