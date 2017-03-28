import React, { Component } from 'react';
import CSSModule from 'react-css-modules';

import { Input } from 'antd';
import style from './style.M.less';

const Search = Input.Search;
const prefix = 'page-search';

@CSSModule(style)
export default class PageSearch extends Component {
  constructor(props) {
    super();
  }

  render() {
    const { leftSection, search } = this.props;
    return (<div styleName={`${prefix}`}>
      <div>{leftSection}</div>
      {
        search
        && <div className={`${prefix}-search`}>
          <Search />
        </div>
      }
    </div>);
  }
}
