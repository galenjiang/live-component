import React, { Component } from 'react';
import CSSModule from 'react-css-modules';
import PropTypes from 'prop-types'

import { Input } from 'antd';
import style from './style.M.less';

const Search = Input.Search;
const prefix = 'page-search';

@CSSModule(style)
export default class PageSearch extends Component {

  static propTypes = {
    search: PropTypes.bool,
    onSearch: PropTypes.func,
    leftSection: PropTypes.element,
  }

  static defaultProps = {
    search: true,
    onSearch: () => {},
    leftSection: null,
  }

  constructor(props) {
    super();
  }

  render() {
    const { leftSection, search, onSearch } = this.props;
    return (<div styleName={`${prefix}`}>
      <div>{leftSection}</div>
      {
        search
        && <div className={`${prefix}-search`}>
          <Search
            onSearch={value => onSearch(value)}
          />
        </div>
      }
    </div>);
  }
}
