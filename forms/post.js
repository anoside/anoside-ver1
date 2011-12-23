var form = require('express-form');

var validate = form.validate;


exports.create = form(
  validate('post').required(),
  validate('tagLowerName')
);
