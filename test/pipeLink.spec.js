'use strict';

var chai = require('chai');
var expect = chai.expect;

var pipeLink = require('../pipeLink');

function ReactLink(value, requestChange) {
  this.value = value;
  this.requestChange = requestChange;
}

function nop() {}
function caps(input) { return input && input.toUpperCase(); }
function toObj(text) {return { something: text } };
function fromObj(obj) { return obj.something };

describe('pipeLink', function() {
  var test;

  beforeEach(function() {
    // Shim for a React component
    test = {
      state: {},
      setState: function setState(partial) {
        var keys = Object.keys(partial);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          this.state[key] = partial[key];
        }
      },
      reactLink: function reactLink(key) {
        var that = this;
        return new ReactLink(
          that.state[key],
          function (val) {
            var partialObj = {};
            partialObj[key] = val;
            that.setState(partialObj);
          }
        );
      }
    };
    // Sanity check
    expect(Object.keys(test.state)).to.have.length(0);
  });

  it('should throw when ReactLink object is missing', function() {
    var errorMsg = 'ReactLink piped transforms requires an original ReactLink object (the return type of this.linkState)';

    expect(function() {
      pipeLink(nop, null, nop);
    }).to.throw(errorMsg);

    expect(function() {
      pipeLink(nop, {}, nop);
    }).to.throw(errorMsg);
  });

  it('should throw when transforms are not functions', function() {
    var errorMsg = 'ReactLink piped transforms must be functions';

    expect(function() {
      pipeLink({}, test.reactLink('a'), nop);
    }).to.throw(errorMsg);

    expect(function() {
      pipeLink(nop, test.reactLink('a'), {});
    }).to.throw(errorMsg);
  });

  it('should work with no transforms', function() {
    test.setState({ a: 'wrong' });
    expect(test.state.a).to.equal('wrong');
    pipeLink(test.reactLink('a')).requestChange('correct');
    expect(test.state.a).to.equal('correct');
  });

  it('should transform getting value', function() {
    test.setState({ a: 'correct' });
    expect(test.state.a).to.equal('correct');
    var value = pipeLink(caps, test.reactLink('a')).value;
    expect(value).to.equal('CORRECT');
    expect(test.state.a).to.equal('correct');
  });

  it('should transform putting value', function() {
    test.setState({ a: 'wrong' });
    expect(test.state.a).to.equal('wrong');
    pipeLink(test.reactLink('a'), caps).requestChange('correct');
    expect(test.state.a).to.equal('CORRECT');
  });

  it('should transform getting and putting values', function() {
    test.setState({ a: 'orig' });
    expect(test.state.a).to.equal('orig');
    var res = pipeLink(caps, test.reactLink('a'), caps);
    var value = res.value;
    res.requestChange('correct');
    expect(value).to.equal('ORIG');
    expect(test.state.a).to.equal('CORRECT');
  });

  it('should transform getting and putting complex values', function() {
    test.setState({ a: { something: 'orig' } });
    expect(test.state.a.something).to.equal('orig');
    var res = pipeLink(fromObj, test.reactLink('a'), toObj);
    var value = res.value;
    res.requestChange('correct');
    expect(value).to.equal('orig');
    expect(test.state.a.something).to.equal('correct');
  });
});
