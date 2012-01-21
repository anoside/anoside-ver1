var mongoose = require('mongoose')
  , PostTag = require('./post_tag').PostTag;

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

  
var PostSchema = new Schema({
    title: { type: String, required: true }
  , body: { type: String }
  , tagNames: [String]
  , createdAt: { type: Date, default: Date.now }
  , comments: [{ type: ObjectId, ref: 'Comment' }]
  , user: { type: ObjectId, ref: 'User' }
});


PostSchema.methods.addTag = function (tag, callback) {
  var self = this;

  if (self.tagNames.indexOf(tag.name) === -1) { // tagが追加されていなかったら
    self.tagNames.push(tag.name);
    self.save(function (err) {
      var postTag = new PostTag({ post: self, tag: tag });
      
      postTag.save(function (err) {
        callback(err);
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
