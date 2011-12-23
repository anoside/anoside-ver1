define(function (require) {
  var Post   = require('../models/post').Post
    , socket = require('../utils/socket')
    , posts  = require('../views/posts')
    , tags   = require('../views/tags');

  return {
    Route: Backbone.Router.extend({
      routes: {
        't/:name': 'show'
      },

      show: function (name) {
        var soc = socket.connect();

        new posts.PostFormView({ model: new Post(), socket: soc });
        new tags.TagTimelineView({ tagName: name, socket: soc });
      }
    })
  }
});
