var assert = require('assert')
  , vows   = require('vows')
  , helper = require('../helper');


vows.describe('models.tag').addBatch({
  '#incPostsCount': {
    topic: function () {
      var self = this;

      helper.initDB(function () {
        var tag = new Tag({ name: 'tagtag', lowerName: 'TagTag' });

        tag.save(function (err) {
          tag.incPostsCount(function (err) {
            Tag.findOne({}, self.callback);
          });
        });
      });
    },
    'should increase postsCount to 1': function (err, tag) {
      assert.equal(tag.postsCount, 1);
    }
  }
}).export(module);
