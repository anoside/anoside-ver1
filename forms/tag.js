var form = require('express-form');

var filter   = form.filter
  , validate = form.validate;


exports.create = form(
    filter('name').trim()
  , filter('name').regex(/^[^`^~^!^@^#^$^%^^^&^*^(^)^-^+^=^\[^{^\]^}^\^|^;^:^'^"^,^<^.^>^/^?~ ]*$/, 'そのタグは追加できません')
  , validate('name').required()
  , validate('post_id').required()
);
