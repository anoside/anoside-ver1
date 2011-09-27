define(function (require) {
  var sessions = require('../views/sessions');

  return {
    Route: Backbone.Router.extend({
      routes: {
        'signin': 'signin'
      },

      signin: function () {
        console.log('signin');
        new sessions.SigninFormView();
      }
    })
  }
});
