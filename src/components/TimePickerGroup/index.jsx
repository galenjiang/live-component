import React, { Component } from 'react';
import CSSModule from 'react-css-modules';
import update from 'immutability-helper';
import moment from 'moment';

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
    this.state = {
      day: 'today',
      range: [null, null]
    }
  }

  onChange = () => {
    const { onChange } = this.props;
    onChange();
  }

  dayChange = (e) => {
    const { onChange } = this.props;
    if (e.target.value === 'yesterday') {
      this.setState(update(this.state, {
        day: { $set: 'yesterday' },
        range: { $set: [null, null] },
      }), () => {
        onChange([moment().subtract(1, 'd').startOf('day'), moment().subtract(1, 'd').endOf('day')]);
      });
    } else if (e.target.value === 'today') {
      this.setState(update(this.state, {
        day: { $set: 'today' },
        range: { $set: [null, null] },
      }), () => {
        onChange([moment().startOf('day'), moment().endOf('day')]);
      });
    }
  }

  rangePickerChange = (value) => {
    const { onChange } = this.props;
    this.setState(update(this.state, {
      day: { $set: '' },
      range: { $set: value },
    }), () => {
      onChange(value);
    });
  }

  render() {
    const { day, range } = this.state;
    const { dayChange, rangePickerChange } = this;
    return (<div styleName={`${prefix}`}>
      <RadioGroup
        value={day}
        onChange={dayChange}
      >
        <RadioButton value="today">今日</RadioButton>
        <RadioButton value="yesterday">昨日</RadioButton>
      </RadioGroup>
      <div styleName={`${prefix}-range-picker`}>
        <RangePicker
          format="YYYY/MM/DD HH:mm:ss"
          showTime
          value={range}
          onChange={rangePickerChange}
        />
      </div>
    </div>);
  }
}



