var assert = require('assert')
  , vows   = require('vows')
  , string = require('../../utils/string');


vows.describe('utils.string').addBatch({
  '#splitPost': {
    topic: string.splitPost('hello\nworld'),

    'should return title': function (ary) {
      assert.equal(ary[0], 'hello');
    },
    'should return body': function (ary) {
      assert.equal(ary[1], 'world');
    },
      
    'valid2': {
      topic: string.splitPost('\n\nhello!\n\n\n\n\nworld!\n\n\n\n'),
      
      'should.return title': function (ary) {
        assert.equal(ary[0], 'hello!');
      },
      'should return body': function (ary) {
        assert.equal(ary[1], 'world!');
      }
    }
  }
}).export(module);
