define(function (require) {
  var PostCollection = require('../collections/post')
    , TimelineView = require('./base').TimelineView;

  return {
    HomeTimelineView: TimelineView.extend({
      initialize: function () {
        _.bindAll(this, 'render');
        this.collection = new PostCollection.HomeTimeline();
        this.collection.bind('reset', this.render);
        this.collection.fetch();
      }
    })
  }
});
