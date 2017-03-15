import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const MenuItem = Menu.Item;

export default class Aside extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Menu
        mode="inline"
      >
        <MenuItem>
          <Link to="/ads/resource">
            <Icon type="pie-chart" />
            广告资源设置
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/ads/tag">
            <Icon type="bars" />
            广告热点设置
          </Link>
        </MenuItem>
      </Menu>

    );
  }
}
