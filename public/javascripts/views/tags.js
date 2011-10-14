define(function (require) {
  var PostCollection = require('../collections/post')
    , PostView       = require('../views/posts').PostView;

  return {
    TagTimelineView: PostView.extend({
      initialize: function (options) {
        var tagName = options.tagName;
        
        this.socket = options.socket;
        PostView.prototype.initialize({ socket: this.socket });

        _.bindAll(this, 'render');
        this.collection = new PostCollection.TagTimeline(null, { tagName: tagName });
        this.collection.bind('reset', this.render);
        this.collection.fetch();
      }
    })
  }
});
