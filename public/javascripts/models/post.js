define(function () {
  var Post = Backbone.Model.extend({});

  var SinglePost = Post.extend({
    initialize: function (attributes) {
      this.postId = attributes.postId;
    },
    
    url: function () {
      return '/posts/' + this.postId;
    }
  });

  return { Post: Post, SinglePost: SinglePost }
});
