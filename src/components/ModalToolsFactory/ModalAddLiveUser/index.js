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
import { Button, Form, Input, Modal } from 'antd'

//mine
import decorator from '../../../libs/decorator/decorator.ant.form'

@decorator({
  mapPropsToFields: function () {
    return {
      username: '',
      platformUserId: ''
    }
  }
})
export default class ModalAddLiveUser extends Component {
  constructor(props) {
    super(props)
    const confirmLoading = false
    this.state = { confirmLoading }
  }

  static propsType = {
    onOkClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  onOkClick() {
    let { onOkClick } = this.props
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        confirmLoading: true
      }, ()=> {
        onOkClick(values).then(()=> {
          this.setState({
            confirmLoading: false
          })
        })
      })
    })
  }

  onCancelClick() {
    let { onCancelClick } = this.props
    onCancelClick.call(this)
  }

  render() {
    const { visible } = this.props

    const { confirmLoading } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      required: true
    }
    const noop = function () {
      return false
    }
    const { getFieldProps } = this.props.form
    const FormItem = Form.Item

    return (
      <div data-react-component="consoleModalAddLiveUser">
        <Modal title="添加主播" visible={visible} onOk={()=>this.onOkClick()} onCancel={()=>this.onCancelClick()}
               confirmLoading={confirmLoading}>
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              label="主播名">
              <Input {...getFieldProps('username', {
                initialValue: '',
                rules: [{
                  required: true,
                  whitespace: true,
                  message: '请输入主播名'
                }]
              })} placeholder="" onPaste={noop}
                     onCopy={noop} onCut={noop}
                     autoComplete="off"/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="主播ID">
              <Input {...getFieldProps('platformUserId', {
                initialValue: '',
                rules: [{
                  required: true,
                  whitespace: true,
                  message: '请输入主播ID'
                }]
              })} placeholder="" onPaste={noop}
                     onCopy={noop} onCut={noop}
                     autoComplete="off"/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}