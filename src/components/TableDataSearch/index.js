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
import ReactDOM from 'react-dom'
//Third-part
import { Input, Button } from 'antd'
const InputGroup = Input.Group
//mine

export default class TableDataSearch extends Component {
  constructor(props) {
    super(props)
  }

  static propsType = {
    searchKeyword: PropTypes.string.isRequired,
    onSearchClick: PropTypes.func.isRequired,
    searchPlaceholder: PropTypes.string
  }

  static defaultProps = {
    searchKeyword: '',
    searchPlaceholder: '搜索',
    onSearchClick() {

    }
  }

  __onSearchClick(e) {
    const { onSearchClick } = this.props
    e.preventDefault()
    let { searchInput } = this.refs
    let searchKeyword = searchInput.refs.input.value
    onSearchClick(searchKeyword)
  }

  __onResetSearchKeyWordClick() {
    const { onSearchClick } = this.props
    let { searchInput } = this.refs
    searchInput.refs.input.value = ''
    onSearchClick(null)
  }

  render() {
    const { searchKeyword, searchPlaceholder } = this.props

    return (
      <form action="javascript:;" onSubmit={(e) => this.__onSearchClick(e)}>
        <InputGroup className="ant-search-input">
          <Input placeholder={searchPlaceholder} ref="searchInput"/>
          <div className="ant-input-group-wrap">
            {
              searchKeyword
                ?
                <Button icon="cross" type="primary" className="ant-search-btn"
                        onClick={() => this.__onResetSearchKeyWordClick()}/>
                :
                <Button icon="search" type="submit" className="ant-search-btn" htmlType="submit"/>
            }

          </div>
        </InputGroup>


      </form>
    )
  }
}