var mongoose = require('mongoose')
  , PostTag = require('./post_tag').PostTag;

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

  
var PostSchema = new Schema({
    title: { type: String, required: true }
  , body: { type: String }
  , created_at: { type: Date, default: Date.now }
  , comments: [{ type: ObjectId, ref: 'Comment' }]
  , tags: [{ type: ObjectId, ref: 'Tag' }]
  , user: { type: ObjectId, ref: 'User' }
});


PostSchema.methods.addTag = function (tag, callback) {
  var self = this;

  if (self.tags.indexOf(tag._id) === -1) { // tagが追加されていなかったら
    self.tags.push(tag);
    self.save(function (err) {
      var post_tag = new PostTag({ post: self, tag: tag });
      post_tag.save(function (err) {
        tag.incPostsCount(function (err) {
          callback(err);
        });
      });
    });
  } else {
    callback({ message: 'すでに追加されています' });
  }
};

PostSchema.statics.getById = function (id, callback) {
  Post.findById(id, function (err, post) {
    err ? callback(null) : callback(post);
  });
};


exports.Post = Post = mongoose.model('Post', PostSchema);
