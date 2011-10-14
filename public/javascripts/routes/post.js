define(function (require) {
  var socket = require('../utils/socket')
    , posts  = require('../views/posts');

  return {
    Route: Backbone.Router.extend({
      routes: {
        'posts/:id': 'show'
      },

      show: function (id) {
        var soc = socket.connect();

        new posts.SinglePostView({ postId: id, socket: soc });
      }
    })
  }
});
