var form = require('express-form');

var filter   = form.filter
  , validate = form.validate;


exports.create = form(
    filter('body').trim()
  , validate('body').required()
  , validate('post_id').required()
);
