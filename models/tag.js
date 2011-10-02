var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

  
var TagSchema = new Schema({
    name: { type: String, required: true, unique: true }
  , created_at: { type: Date, default: Date.now }
  , posts_count: { type: Number, default: 0, index: true }
});


TagSchema.methods.incPostsCount = function (callback) {
  Tag.update({ _id: this._id }, { $inc: { posts_count: 1 } }, function (err) {
    callback(err);
  });
};


exports.Tag = Tag = mongoose.model('Tag', TagSchema);
