ReactLink-Pipe [![Version][npm-image]][npm-url]
================

Pipeline for ReactLink data binding methods; used for things like data validation and formatting.



### Background on ReactLink

[React](https://facebook.github.io/react/) provides a method, known as [ReactLink](https://facebook.github.io/react/docs/two-way-binding-helpers.html), to update `this.state` on a component whenever the value of an `<input>` field changes. This method is exposed by the convenient mixin `React.addons.LinkedStateMixin`, which essentially just binds the `onChange` event handler to the `this.setState()` function of the `<input>` field.

### Transforms and Pipelines

This module exposes a helper function that provides an easy and convenient way to setup a pipeline of transform functions between getting and setting values in the ReactLink flow.

This lets you do things like automatically format text entered by a user as uppercase, or convert a special class to JSON before trying to display it in your React component.

## Usage

Install it with `npm install --save reactlink-pipe`.

Exposes function of form: `pipeLink(getValTransformFunc, reactLinkObject, setValTransformFunc)`.

### Transformation on getting state source

Runs the first transform function over the state source before returning it to React.

```js
var pipeLink = require('reactlink-pipe');

function caps(text) { return text && text.toUpperCase(); }

var WithLink = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return { name: 'foo' };
  },
  render: function() {
    // Will display "FOO", while this.state.name will still be "foo"
    return (
      <input type="text" valueLink={pipeLink(caps, this.linkState('name'))} />
    );
  }
});
```

### Transformation on setting state source

Runs the second transform function over the React value before returning it to the state source.

```js
var pipeLink = require('reactlink-pipe');

function caps(text) { return text && text.toUpperCase(); }

var WithLink = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return { name: 'foo' };
  },
  render: function() {
    // Will display "foo", while this.state.name will be set to "FOO" when changed
    return (
      <input type="text" valueLink={pipeLink(this.linkState('name'), caps)} />
    );
  }
});
```


### Or put transforms for both getting and setting!

```js
var pipeLink = require('reactlink-pipe');

function toObj(text) { return { something: text } };
function fromObj(obj) { return obj.something };

var WithLink = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {
      obj: {
        something: 'foo'
      }
    };
  },
  render: function() {
    // Will display "foo", even though this.state.obj is stored as an object and not a string.
    // this.state.obj.something will continue to update and display properly as the user types.
    return (
      <input type="text" valueLink={pipeLink(fromObj, this.linkState('obj'), toObj)} />
    );
  }
});
```

## Credits

- Author: [David Idol](http://daveidol.com)
- License: [MIT](http://opensource.org/licenses/MIT)


[npm-image]: https://img.shields.io/npm/v/reactlink-pipe.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/reactlink-pipe
