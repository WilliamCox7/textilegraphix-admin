import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './style.scss';

class PromptModal extends Component {
  render() {
    return (
      <div id="PromptModal" className="flex jc-c">
        <div className="dialog-box flex fd-c jc-sb">
          <h1>{this.props.message}</h1>
          <div className="flex jc-sb">
            <button onClick={this.props.callback}>{this.props.buttonAction}</button>
            <button onClick={this.props.cancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PromptModal;
