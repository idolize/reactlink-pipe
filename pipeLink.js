'use strict';

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

function identity(input) {
  return input;
}

var pipeLink = function(getting, reactLink, putting) {
  if (getting && !isFunction(getting)) {
    // optional 'getting' function not specified in this pipeline
    putting = reactLink;
    reactLink = getting;
    getting = identity;
  }
  putting = putting || identity;

  if (!isFunction(getting) || !isFunction(putting)) {
    throw new Error('ReactLink piped transforms must be functions');
  }
  if (!reactLink || !isFunction(reactLink.requestChange)) {
    throw new Error('ReactLink piped transforms requires an original ReactLink object (the return type of this.linkState)');
  }

  // Runs the first ('getting') transform over the state source before returning it to React,
  // and the second ('putting') transform over the React value before returning it to the state source.
  return {
    value: getting(reactLink.value),
    requestChange: function requestChange(valueToSetInState) {
      return reactLink.requestChange(putting(valueToSetInState));
    }
  };
};

module.exports = pipeLink;
