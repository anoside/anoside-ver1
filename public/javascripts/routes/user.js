define(function (require) {
  var posts  = require('../views/posts')
    , users  = require('../views/users')
    , Post   = require('../models/post').Post
    , User   = require('../models/user').User
    , socket = require('../utils/socket');

  return {
    Route: Backbone.Router.extend({
      routes: {
          '': 'home'
        , 'signup': 'signup'
      },

      home: function () {
        var soc = socket.connect();

        new posts.PostFormView({ model: new Post(), socket: soc });
        new posts.HomeTimelineView({ socket: soc });
      },

      signup: function () {
        new users.SignupFormView({ model: new User() });
      }
    })
  }
});
