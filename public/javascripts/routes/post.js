define(function (require) {
  var posts = require('../views/posts');

  return {
    Route: Backbone.Router.extend({
      routes: {
        'posts/:id': 'show'
      },

      show: function (id) {
        new posts.SinglePostView(id);
      }
    })
  }
});
