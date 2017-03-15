import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import style from './style.M.less';

@CSSModules(style)
export default class Header extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div styleName="header">组件展示</div>
    );
  }
}
