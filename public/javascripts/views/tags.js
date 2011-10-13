define(function (require) {
  var PostCollection = require('../collections/post')
    , PostView       = require('../views/posts').PostView;

  return {
    TagTimelineView: PostView.extend({
      initialize: function (name) {
        _.bindAll(this, 'render');
        this.collection = new PostCollection.TagTimeline(null, { tagName: name });
        this.collection.bind('reset', this.render);
        this.collection.fetch();
      }
    })
  }
});
