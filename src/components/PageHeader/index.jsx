import React, { Component } from 'react';
import CSSModule from 'react-css-modules';

import style from './style.M.less';

const prefix = 'page-header';

@CSSModule(style)
export default class PageHeader extends Component {
  constructor(props) {
    super();
  }

  render() {
    const { title, rightSection } = this.props;
    return (<div styleName={`${prefix}`}>
      <h2 styleName={`${prefix}-title`}>{title}</h2>
      <div>{rightSection}</div>
    </div>);
  }
}
