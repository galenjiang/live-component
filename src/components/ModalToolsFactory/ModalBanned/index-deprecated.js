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
//mine
import  Modal  from '../Modal'

//TODO This class is deprecated
class ModalBanned extends Component {
  constructor(props) {
    super(props)
    const visible = true
    this.state = { visible }
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    validation: PropTypes.func
  }
  static defaultProps = {
    validation(){
      return true
    },
    onCancel(){
    },
    onOk(){
    }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  __onCancel() {
    const { onCancel } = this.props
    this.setState({
      visible: false
    }, ()=> {
      onCancel && onCancel.call(this)
    })
  }

  __onOk() {
    let { validation, onOk } = this.props
    if (validation.call(this)) {
      this.setState({
        visible: false
      }, ()=> {
        let { bannedMsg } = this.refs
        onOk && onOk.call(this, ReactDOM.findDOMNode(bannedMsg).querySelector('input').value)
      })
    }
  }

  render() {
    const { visible } = this.state
    const { title, onCancel } = this.props

    const content = (
      <form ref="form" onSubmit={e=>e.preventDefault()}>
        <Input placeholder="请输入封禁理由!" ref="bannedMsg" required/>
      </form>)

    const footer = (
      <div>
        <Button data-button-type="cancel" type="primary" onClick={()=>this.__onCancel()}>取消</Button>
        <Button data-button-type="confirm" type="primary" htmlType="submit" onClick={()=>this.__onOk()}>确定</Button>
      </div>)

    return (
      <Modal title={title} content={content} footer={footer} visible={visible} onCancel={()=>onCancel()}/>
    )
  }
}
export default{
  ModalBanned: ModalBanned,
  show(props){
    const modal = document.createElement('div')
    modal.setAttribute('react-component', 'consoleModalBanned')
    document.body.appendChild(modal)
    ReactDOM.render(<ModalBanned  {...props}/>, modal)
  }
}