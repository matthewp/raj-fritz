var program = function (program) {
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

function fritzProgram(Component, createApp) {
  return class extends Component {
    makeProgram(props, initial) {
      this.killProgram();
      const app = createApp(props);
      this._view = app.view;
      this._killProgram = program(Object.assign({}, app, {
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
      // TODO this is wrong
      if(newProps !== this.props) {
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

export { fritzProgram as program };
