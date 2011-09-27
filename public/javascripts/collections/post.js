define(function () {
  return {
    HomeTimeline: Backbone.Collection.extend({
      url: '/posts/timeline'
    }),

    TagTimeline: Backbone.Collection.extend({
      initialize: function (name) {
        this.name = name;
      },

      url: '/t/' + this.name
    })
  }
});
