define(function () {
  return {
    Comments: Backbone.Collection.extend({
      initialize: function (models, postId) {
        this.postId = postId;
      },

      url: function () {
        return '/posts/' + this.postId + '/comments'
      }
    })
  }
});
