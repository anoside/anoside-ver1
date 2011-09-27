define(function (require) {
  require.ready(function () {
    var SessionRoute = require('routes/session').Route
      , TagRoute = require('routes/tag').Route
      , UserRoute = require('routes/user').Route;

    new SessionRoute();
    new UserRoute();
    new TagRoute();

    Backbone.history.start({ pushState: true });
  });
});
