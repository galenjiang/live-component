// official
import React, { Component, PropTypes } from 'react';

// Third-part
import { Icon } from 'antd';
// mine
import './Breadcrumb.less';

export default class Breadcrumb extends Component {
  static propTypes = {
    wrapClassName: PropTypes.string,
    breadcrumbList: PropTypes.arrayOf(PropTypes.string),
    current: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    wrapClassName: '',
    breadcrumbList: [],
    current: 0,
    onChange() {},
  }

  constructor(props) {
    super(props);
  }

  __onBreadcrumbItemClick(current) {
    const { onChange } = this.props;
    onChange(current);
  }

  render() {
    const classNamePrefix = 'Breadcrumb'
    const { wrapClassName, breadcrumbList, current } = this.props
    return (
      <div className={`${classNamePrefix} ${wrapClassName}`}>
        <div className={`${classNamePrefix}-content`}>
          {
            breadcrumbList.map((item, index)=> {
              return (
                <section
                  key={index}
                  className={`${classNamePrefix}-item ${current === index ? 'active' : ''}`}
                  onClick={()=>this.__onBreadcrumbItemClick(index)}
                >
                    <span className={`${classNamePrefix}-counter`}>
                      {index + 1}
                    </span>
                  <Icon type="check-circle-o" />
                  {item}
                </section>
              )
            })
          }
        </div>

      </div>
    )
  }
}
