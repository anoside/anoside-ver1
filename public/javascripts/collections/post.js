define(function () {
  return {
    HomeTimeline: Backbone.Collection.extend({
      url: '/posts/timeline'
    }),

    TagTimeline: Backbone.Collection.extend({
      initialize: function (models, options) {
        this.tagName = options.tagName;
      },

      url: function () {
        return '/posts/tags/' + this.tagName;
      }
    })
  }
});
