var mongoose = require('mongoose')
  , hash = require('../utils/hash');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

  
var UserSchema = new Schema({
    signinid: { type: String, required: true, unique: true }
  , password: { type: String, required: true }
  , reset_password_token: String
  , createdAt: { type: Date, default: Date.now }
  , joinedAt: Date
});


UserSchema.virtual('raw_password').set(function (rawPassword) {
  this.password = hash.getPassword('sha256', rawPassword);
});

UserSchema.statics.getById = function (id, callback) {
  User.findById(id, function (err, doc) {
    err ? callback(null) : callback(doc);
  });
};

UserSchema.statics.signin = function (form, callback) {
  User.findOne({ signinid: form.signinid }, function (err, user) {
    if (user && hash.checkPassword(form.password, user.password)) {
      callback(user);
    } else {
      callback(null);
    }
  });
};

UserSchema.statics.signup = function (form, callback) {
  User.findOne({ signinid: form.signinid }, function (err, doc) {
    if (doc) {
      callback(['そのログインIDはすでに登録されています']);
    } else {
      var user = new User({
          signinid: form.signinid
        , raw_password: form.password
      });
      user.save(function (err) {
        callback(null, user);
      });
    }
  });
};

exports.User = User = mongoose.model('User', UserSchema);
