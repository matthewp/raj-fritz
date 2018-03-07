(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.fritzProgram = factory());
}(this, (function () { 'use strict';

var program$1 = function (program) {
  var update = program.update;
  var view = program.view;
  var done = program.done;
  var state;
  var isRunning = true;
  var timeout = setTimeout;

  function dispatch (message) {
    if (isRunning) {
      change(update(message, state));
    }
  }

  function change (change) {
    state = change[0];
    var effect = change[1];
    if (effect) {
      timeout(function () { effect(dispatch); }, 0);
    }
    view(state, dispatch);
  }

  change(program.init);

  return function kill () {
    if (!isRunning) {
      return
    }
    isRunning = false;
    if (done) {
      done(state);
    }
  }
};

var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

var index = function equal(a, b) {
  if (a === b) return true;

  var arrA = isArray(a)
    , arrB = isArray(b)
    , i
    , length
    , key;

  if (arrA && arrB) {
    length = a.length;
    if (length != b.length) return false;
    for (i = 0; i < length; i++)
      if (!equal(a[i], b[i])) return false;
    return true;
  }

  if (arrA != arrB) return false;

  var dateA = a instanceof Date
    , dateB = b instanceof Date;
  if (dateA != dateB) return false;
  if (dateA && dateB) return a.getTime() == b.getTime();

  var regexpA = a instanceof RegExp
    , regexpB = b instanceof RegExp;
  if (regexpA != regexpB) return false;
  if (regexpA && regexpB) return a.toString() == b.toString();

  if (a instanceof Object && b instanceof Object) {
    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = 0; i < length; i++)
      if (!hasProp.call(b, keys[i])) return false;

    for (i = 0; i < length; i++) {
      key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
};

function fritzProgram(Component, createApp) {
  return class extends Component {
    makeProgram(props, initial) {
      this.killProgram();
      const app = createApp(props);
      this._view = app.view;
      this._killProgram = program$1(Object.assign({}, app, {
        view: (state, dispatch) => {
          this._dispatch = dispatch;
          if(initial) {
            this.state = {state};
            initial = false;
          } else {
            this.setState(() => ({state}));
          }
        }
      }));
    }

    killProgram() {
      if(this._killProgram) {
        this._killProgram();
        this._killProgram = undefined;
      }
    }

    componentWillReceiveProps(newProps) {
      if(!index(newProps, this.props)) {
        this.makeProgram(newProps, false);
      }
    }

    componentWillUnmount() {
      this.killProgram();
    }

    render() {
      return this._view(this.state.state, this._dispatch);
    }
  };
}

return fritzProgram;

})));
