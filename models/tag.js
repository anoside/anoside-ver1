var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

  
var TagSchema = new Schema({
    name: { type: String, required: true }
  , lowerName: { type: String, lowercase: true, required: true, unique: true }
  , createdAt: { type: Date, default: Date.now }
  , postsCount: { type: Number, default: 0, index: true }
});


TagSchema.methods.incPostsCount = function (callback) {
  Tag.update({ _id: this._id }, { $inc: { postsCount: 1 } }, function (err) {
    callback(err);
  });
};


exports.Tag = Tag = mongoose.model('Tag', TagSchema);
