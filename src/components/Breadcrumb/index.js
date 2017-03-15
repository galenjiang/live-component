//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
'use strict'
//official
import React, { Component, PropTypes } from 'react'

//Third-part
import { Icon } from 'antd'
//mine
import './Breadcrumb.less'
export default class Breadcrumb extends Component {
  constructor(props) {
    super(props)
  }

  static propsType = {
    wrapClassName: PropTypes.string,
    breadcrumbList: PropTypes.array.required,
    current: PropTypes.number,
    onChange: PropTypes.func
  }
  static defaultProps = {
    wrapClassName: '',
    breadcrumbList: [],
    current: 0,
    onChange(){

    }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentWillUnmount() {

  }

  __onBreadcrumbItemClick(current) {
    const { onChange } = this.props
    onChange && onChange(current)
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
                  onClick={()=>this.__onBreadcrumbItemClick(index)}>
                    <span className={`${classNamePrefix}-counter`}>
                      {index + 1}
                    </span>
                  <Icon type="check-circle-o"/>
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