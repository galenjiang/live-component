import React, { Component } from 'react';
import CSSModule from 'react-css-modules';
import style from './style.M.less';
// import { } from 'antd';
@CSSModule(style)
export default class FourOFour extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <section styleName="FourOFour">
        404
      </section>

    );
  }
}
