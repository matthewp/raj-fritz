import { program } from 'raj/runtime';
import deepEqual from 'fast-deep-equal';

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
      if(!deepEqual(newProps, this.props)) {
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

export {
  fritzProgram as program
};
