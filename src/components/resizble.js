import { Resizable } from 'react-resizable';
import React from 'react';
export default class ExampleLayout extends React.Component {
  state = {
    width: 200,
    height: 200,
  };

  onResize = (event, {node, size, handle}) => {
    this.setState({width: size.width, height: size.height});
  };

  render() {
    return (
      <Resizable height={this.state.height} width={this.state.width} onResize={this.onResize}>
        <div className="box" style={{width: this.state.width + 'px', height: this.state.height + 'px'}}>
          <span>Contents</span>
        </div>
      </Resizable>
    );
  }
}