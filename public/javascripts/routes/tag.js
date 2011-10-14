define(function (require) {
  var socket = require('../utils/socket')
    , tags   = require('../views/tags');

  return {
    Route: Backbone.Router.extend({
      routes: {
        't/:name': 'show'
      },

      show: function (name) {
        var soc = socket.connect();

        new tags.TagTimelineView({ tagName: name, socket: soc });
      }
    })
  }
});
