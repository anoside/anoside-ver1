var TagForm    = require('../forms/tag')
  , Post       = require('../models/post').Post
  , Tag        = require('../models/tag').Tag
  , middleware = require('../utils/middleware');

var loadUser = middleware.loadUser;


module.exports = function (app) {

  /**
   * タグの保存
   */

  app.post('/tags/create', loadUser, TagForm.create, function (req, res) {
    if (req.form.isValid) {
      Post.findById(req.form.post_id, function (err, post) {
        var lowerTagName = req.form.name.toLowerCase();

        Tag.findOne({ lowerName: lowerTagName }, function (err, tag) {
          if (tag) {
            post.addTag(tag, function (err) {
              if (!err) {
                  res.send({ tag: tag });
              } else {
                res.send({ errors: [err.message] }, 403);
              }
            });
          } else {
            var tag = new Tag({ name: req.form.name, lowerName: req.form.name });
            
            tag.save(function (err) {
              if (!err) {
                post.addTag(tag, function (err) {
                  if (!err) {
                    res.send({ tag: tag });
                  }
                });
              } else {
                res.send({ errors: [err] }, 403);
              }
            });
          }
        });
      });
    } else {
      res.send({ errors: req.form.errors }, 403);
    }
  });

  /**
   * 個別のページ
   */

  app.get('/t/:name', loadUser, function (req, res) {
    var lowerTagName = req.params.name.toLowerCase();

    Tag.findOne({ lowerName: lowerTagName }, function (err, tag) {
      if (tag) {
        res.render('tags/show', {
            title: tag.name
          , user: req.user
          , tag: tag
          , csrfToken: req.session._csrf
        });
      } else {
        res.send(404);
      }
    });
  });
};
