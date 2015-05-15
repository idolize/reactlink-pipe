ReactLink-Pipe
================

## Background on ReactLink

[React](https://facebook.github.io/react/) provides a method, known as [ReactLink](https://facebook.github.io/react/docs/two-way-binding-helpers.html), to update `this.state` on a component whenever the value of an `<input>` field changes. This method is exposed by the convenient mixin `React.addons.LinkedStateMixin`, which essentially just binds the `onChange` event handler to the `this.setState()` function of the `<input>` field.

## Transforms and Pipelines

This module exposes a helper function that provides an easy and convenient way to setup a pipeline of transform functions between getting and setting values in the ReactLink flow.

This let's you do things like automatically format text entered by a user as uppercase, or convert a special class to JSON before trying to display it in your React component.

## Usage

Install it with `npm install --save reactlink-pipe`.

### State source getting transform

Runs the first transform function over the state source before returning it to React.

```js
var LinkedImmutableStateMixin = require('reactlink-immutable');
var pipeLink = require('reactlink-pipe');

function caps(text) { return text && text.toUpperCase(); }

var WithLink = React.createClass({
  mixins: [LinkedImmutableStateMixin],
  getInitialState: function() {
    return { name: 'foo' };
  },
  render: function() {
    // Will display "FOO" on first render, while this.state.name will still be "foo"
    return (
      <input type="text" valueLink={pipeLink(caps, this.linkState('name'))} />
    );
  }
});
```

### State source setting transform

Runs the second transform function over the React value before returning it to the state source.

```js
var LinkedImmutableStateMixin = require('reactlink-immutable');
var pipeLink = require('reactlink-pipe');

function caps(text) { return text && text.toUpperCase(); }

var WithLink = React.createClass({
  mixins: [LinkedImmutableStateMixin],
  getInitialState: function() {
    return { name: 'foo' };
  },
  render: function() {
    // Will display "foo" on first render, while this.state.name will still be set to "FOO" when changed
    return (
      <input type="text" valueLink={pipeLink(this.linkState('name'), caps)} />
    );
  }
});
```


### Or put transforms for both getting and setting!

```js
var LinkedImmutableStateMixin = require('reactlink-immutable');
var pipeLink = require('reactlink-pipe');

function toObj(text) { return { something: text } };
function fromObj(obj) { return obj.something };

var WithLink = React.createClass({
  mixins: [LinkedImmutableStateMixin],
  getInitialState: function() {
    return { name: 'foo' };
  },
  render: function() {
    return (
      <input type="text" valueLink={removeWhiteSpace, pipeLink(fromObj, this.linkState('name'), toObj)} />
    );
  }
});
```

## Credits

- Author: [David Idol](http://daveidol.com)
- License: [MIT](http://opensource.org/licenses/MIT)