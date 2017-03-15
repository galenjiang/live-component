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
import { Form, Input, Modal } from 'antd'
//mine
import decorator from '../../../libs/decorator/decorator.ant.form'

@decorator({
  mapPropsToFields: function () {
    return {
      bannedMsg: ''
    }
  }
})
export default class ModalBanned extends Component {
  constructor(props) {
    super(props)
    const confirmLoading = false
    this.state = { confirmLoading }
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    onOkClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  static defaultProps = {
    onOkClick() {

    },
    title: '确定封禁?'
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillReceiveProps(props) {
    this.setState({
      data: props.data
    })
  }

  componentWillUnmount() {

  }

  onCancelClick() {
    let { onCancelClick } = this.props
    onCancelClick && onCancelClick()
  }

  onOkClick() {
    let { form } = this.refs
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      const { data } = this.state
      const { onOkClick } = this.props

      this.setState({
        confirmLoading: true
      }, ()=> {
        onOkClick && onOkClick(values.bannedMsg, data).then(()=> {
          this.setState({
            confirmLoading: false
          })
        })
      })
    })
  }

  render() {

    const { confirmLoading } = this.state
    const { title, visible } = this.props
    const formItemLayout = {
      wrapperCol: { span: 24 },
      require: true
    }
    const { getFieldProps } = this.props.form
    const FormItem = Form.Item

    return (
      <div>
        <Modal title={title} visible={visible} onOk={()=>this.onOkClick()} onCancel={()=>this.onCancelClick()}
               confirmLoading={confirmLoading}>
          <Form horizontal>
            <FormItem
              {...formItemLayout}>
              <Input {...getFieldProps('bannedMsg', {
                initialValue: '',
                rules: [{
                  required: true,
                  whitespace: true,
                  message: '请输入封禁理由'
                }]
              })} placeholder="请输入封禁理由"/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}