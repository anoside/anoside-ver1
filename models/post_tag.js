var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

  
var PostTagSchema = new Schema({
    createdAt: { type: Date, default: Date.now }
  , post: { type: ObjectId, ref: 'Post' }
  , tag: { type: ObjectId, ref: 'Tag' }
});


exports.PostTag = PostTag = mongoose.model('PostTag', PostTagSchema);
