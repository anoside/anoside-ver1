var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

  
var CommentSchema = new Schema({
    body: { type: String, required: true }
  , createdAt: { type: Date, default: Date.now }
  , identityId: { type: String, required: true }
  , post: { type: ObjectId, ref: 'Post' }
  , user: { type: ObjectId, ref: 'User' }
});

exports.Comment = Comment = mongoose.model('Comment', CommentSchema);
