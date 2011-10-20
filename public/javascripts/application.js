define(function (require) {
  require(['domReady'], function (domReady) {
    domReady(function () {
      var PostRoute    = require('routes/post').Route
        , SessionRoute = require('routes/session').Route
        , TagRoute     = require('routes/tag').Route
        , UserRoute    = require('routes/user').Route;

      new PostRoute();
      new SessionRoute();
      new TagRoute();
      new UserRoute();

      Backbone.history.start({ pushState: true });
    });
  });
});
