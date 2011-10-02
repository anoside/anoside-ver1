var assert = require('assert')
  , vows   = require('vows')
  , hash = require('../../utils/hash');


vows.describe('utils.hash').addBatch({
  '#getSalt': {
    topic: hash.getSalt(10),
    'should match': function (topic) {
      assert.match(topic, /^[a-zA-Z0-9~!@#%^&*()_+]{10}$/);
    }
  },

  '#getHexdigest': {
    topic: function () {
      var algorithm = 'sha256'
        , salt = 'sallllt'
        , rawPassword = 'pass';
      return hash.getHexdigest(algorithm, salt, rawPassword);
    },
    'should match': function (topic) {
      assert.match(topic, /^[a-zA-Z0-9]{64}$/);
    }
  },

  '#getPassword': {
    topic: function () {
      var algorithm = 'sha256'
        , rawPassword = 'pass';
      return hash.getPassword(algorithm, rawPassword);
    },
    'should match': function (topic) {
      assert.match(topic, /^sha256\$[a-zA-Z0-9~!@#%^&*()_+]{10}\$[a-zA-Z0-9]{64}$/);
    }
  },

  '#checkPassword': {
    topic: function () {
      var rawPassword = 'pass'
        , password = hash.getPassword('sha256', 'pass');

      return hash.checkPassword(rawPassword, password);
    },
    'should be true': function (topic) {
      assert.isTrue(topic);
    }
  }
}).export(module);
