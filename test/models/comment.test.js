var assert = require('assert')
  , vows   = require('vows')
  , helper = require('../helper');


vows.describe('models.comment').addBatch({
  '#addTag': {
    topic: function () {
      var self = this;

      helper.initDB(function () {
        var post = new Post({ title: 'hello' });

        post.save(function (err) {
          var tag = new Tag({ name: 'tag1' });

          tag.save(function (err) {
            post.addTag(tag, function (err) {
              PostTag.find({}, self.callback);
            });
          });
        });
      });
    },
    'should return 1 postTag': function (err, postTags) {
      assert.length(postTags, 1);
    }
  }
}).export(module);
