define(function (require) {
  var PostCollection = require('../collections/post')
    , TimelineView = require('./base').TimelineView;

  return {
    TagTimelineView: TimelineView.extend({
      initialize: function (name) {
        _.bindAll(this, 'render');
        this.collection = new PostCollection.TagTimeline(null, { tagName: name });
        this.collection.bind('reset', this.render);
        this.collection.fetch();
      }
    })
  }
});
