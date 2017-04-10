// official
import React, { Component, PropTypes } from 'react';
// 3rd-part
import { message } from 'antd';
// mine
import './ColorSelect.less';
export default class ColorSelect extends Component {
  constructor(props) {
    super();
    this.state = {
      current: props.current,
    };
  }

  static propTypes = {
    colors: PropTypes.array.isRequired,
    current: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    colors: [],
    // current: 0,  // antd warning: --use `setFieldsValue` to set it-- remove
    onChange() { },
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('current' in nextProps) {
      const current = nextProps.current;
      this.setState({
        current,
      });
    }
  }

  /**
   * 切换 select
   * @param index
   * @private
   */
  __onColorSelectClick(index) {
    const { onChange, disabled } = this.props;
    if (disabled) {
      return false;
    }
    onChange && onChange(index);
  }

  render() {
    const classNamePrefix = 'ColorSelect';

    const { colors } = this.props;
    const { current } = this.state;
    return (
      <div className={classNamePrefix}>
        {
          colors.map((item, index) => <div
            key={index}
            onClick={() => this.__onColorSelectClick(index)}
            className={`${classNamePrefix}-select${current === index ? ' active' : ''}`}
            style={{ background: item }} />)
        }
      </div>
    );
  }
}
