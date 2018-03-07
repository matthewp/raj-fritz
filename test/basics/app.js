importScripts('../../node_modules/fritz/worker.umd.js');
importScripts('../../raj-fritz.umd.js');

const { h, Component } = fritz;
const program = fritzProgram;

const helloProgram = props => ({
  init: [{...props, count: 0}],
  update (message, model) {
    switch(message) {
      case 'increment':
        return [{...model, count: model.count + 1}];
      default:
        return [model];
    }
  },
  view (model, dispatch) {
    return (
      h('div', [
        h('div', [`Hi ${model.name}!`]),
        h('div', [
          `Count: ${model.count}`
        ]),
        h('button', {onClick: () => dispatch('increment')}, ['Click me'])
      ])
    );
  }
});

const App = program(class extends fritz.Component {
  static get props() {
    return { name: {attribute: true} };
  }
}, helloProgram);

fritz.define('basic-app', App);
