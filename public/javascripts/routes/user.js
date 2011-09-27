define(function (require) {
  var posts = require('../views/posts')
    , users = require('../views/users')
    , Post = require('../models/post').Post
    , User = require('../models/user').User;

  return {
    Route: Backbone.Router.extend({
      routes: {
          '': 'home'
        , 'signup': 'signup'
      },

      home: function () {
        //console.log('home called');
        new users.HomePostFormView({ model: new Post() });
        new posts.HomeTimelineView();
      },

      signup: function () {
        new users.SignupFormView({ model: new User() });
      }
    })
  }
});
