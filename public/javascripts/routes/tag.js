define(function (require) {
  var tags = require('../views/tags');

  return {
    Route: Backbone.Router.extend({
      routes: {
        't/:name': 'show'
      },

      show: function (name) {
        //console.log('home called');
        new tags.TagTimelineView(name);
      }
    })
  }
});
