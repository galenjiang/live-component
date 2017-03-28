import React, { Component } from 'react';
import CSSModule from 'react-css-modules';

import { Input, Radio, DatePicker } from 'antd';


import style from './style.M.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
const prefix = 'time-picker';

@CSSModule(style)
export default class PageSearch extends Component {
  constructor(props) {
    super();
  }

  onChange = () => {
    const { onChange } = this.props;
    onChange();
  }

  render() {
    const { onChange } = this.props;
    return (<div styleName={`${prefix}`}>
      <RadioGroup
        value={'today'}
        onChange={onChange}
      >
        <RadioButton value="today">今日</RadioButton>
        <RadioButton value="yesterday">昨日</RadioButton>
      </RadioGroup>
      <div styleName={`${prefix}-range-picker`}>
        <RangePicker
          format="YYYY/MM/DD HH:mm:ss"
          showTime
          onChange={onChange}
        />
      </div>
    </div>);
  }
}



