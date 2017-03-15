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
// official
import React, { Component, PropTypes } from 'react'

// Third-part
import { Form, Input, Modal, Checkbox, Select, Radio, message } from 'antd'
import _ from 'lodash'

// mine
import './ModalOperator.less'
import decorator from '../../../libs/decorator/decorator.ant.form'

const Option = Select.Option
const RadioGroup = Radio.Group
const FormItem = Form.Item

@decorator()
export default class ModalAddOperator extends Component {

  static propsType = {
    onOkClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    anchorList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    onOkClick() {

    },
    onCancelClick() {

    }
  }

  constructor(props) {
    super(props)
    const confirmLoading = false
    const operatorConfigError = false
    this.state = { confirmLoading, operatorConfigError }
  }


  onOkClick() {
    let { onOkClick, data } = this.props
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      if (!values.statistic && !values.interact && !values.auth && !values.ads) {
        this.setState({ operatorConfigError: true })
        return false
      }

      if(values.auth && values.selectAll === 2 && !values.authTarget.length) {
        message.error('请输入至少一个主播房间')
        return false
      }
      

      const sortedValues = {
        email: values.email,
        password: values.password,
        username: values.username,
        platformUserId: values.platformUserId,
        statistic: values.statistic,
        interact: values.interact,
        ads: values.ads,
        auth: values.auth,
        authTarget: values.selectAll === 1 ? '@all' : _.compact(values.authTarget).join(',')
      }


      this.setState({
        confirmLoading: true,
        operatorConfigError: false
      }, () => {
        // delete values.password

        onOkClick(data, sortedValues).then(() => {
          this.setState({
            confirmLoading: false
          }, () => {
            this.platformChecked = this.state.defaultCheck
          })
        })
      })
    })
  }

  onCancelClick() {
    let { onCancelClick } = this.props
    this.platformChecked = this.state.defaultCheck
    this.setState({
      confirmLoading: false
    }, () => {
      onCancelClick.call(this)
    })
  }

  __onCheckBoxChange(checkedValue) {
    this.platformChecked = checkedValue
  }

  render() {
    const { visible, data, type, defaultCheck, title, anchorList } = this.props

    const initData = _.defaults(
      {
        email: data.email,
        password: data.password,
        username: data.username,
        platformUserId: data.platformUserId,
        statistic: data.statistic,
        interact: data.interact,
        ads: data.ads,
        auth: data.auth,
        selectAll: data.authTarget === '@all' ? 1 : 2,
        authTarget: data.authTarget === '@all' ? [] : (_.isString(data.authTarget) ? _.compact(data.authTarget.split(',')) : [])
      },
      {
        email: '',
        password: 'videojj.com',
        username: '',
        platformUserId: '',
        statistic: false,
        interact: false,
        ads: false,
        auth: false,
        selectAll: 1,
        authTarget: []
      }
    )

    const { confirmLoading, operatorConfigError } = this.state
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      required: true
    }

    const { getFieldDecorator, getFieldValue } = this.props.form

    return (
      <div data-react-component="consoleModalAddLiveUser">
        <Modal
          title={title}
          visible={visible}
          onOk={() => this.onOkClick()}
          onCancel={() => this.onCancelClick()}
          confirmLoading={confirmLoading}
        >
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              label="邮箱"
            >
              {
                getFieldDecorator('email', {
                  initialValue: initData.email,
                  rules: [{
                    type: 'email',
                    required: true,
                    whitespace: true,
                    message: '请输入正确的邮箱'
                  }]
                })(
                  <Input
                    disabled={type === 'edit'}
                    type="email"
                  />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="初始密码"
            >
              {
                getFieldDecorator('password', {
                  initialValue: 'videojj.com',
                  rules: [{
                    required: true,
                    whitespace: true,
                  }]
                })(
                  <Input
                    disabled
                  />
                )
             }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {
                getFieldDecorator('username', {
                  initialValue: initData.username,
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入名称'
                  }]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="ID"
            >
              {
                getFieldDecorator('platformUserId', {
                  initialValue: initData.platformUserId,
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入主播ID'
                  }]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权限分配"
            >

              {
                getFieldDecorator('statistic', {
                  initialValue: Boolean(initData.statistic),
                  valuePropName: 'checked',
                })(
                  <Checkbox>数据统计</Checkbox>
                )
              }

              {
                getFieldDecorator('interact', {
                  initialValue: Boolean(initData.interact),
                  valuePropName: 'checked',
                })(
                  <Checkbox>主播互动</Checkbox>
                )
              }

              {
                getFieldDecorator('ads', {
                  initialValue: Boolean(initData.ads),
                  valuePropName: 'checked',
                })(
                  <Checkbox>平台广告</Checkbox>
                )
              }

              {
                getFieldDecorator('auth', {
                  initialValue: Boolean(initData.auth),
                  valuePropName: 'checked',
                })(
                  <Checkbox>权限管理</Checkbox>
                )
              }
              {
                getFieldValue('auth')
                && (
                  <div>
                      {
                        getFieldDecorator('selectAll', {
                          initialValue: initData.selectAll,
                        })(<RadioGroup
                          initialValue={initData.selectAll}
                        >
                          <Radio value={1}>全部主播权限</Radio>
                          <Radio value={2}>部分主播权限</Radio>
                        </RadioGroup>)
                      }
                      {
                        getFieldDecorator('authTarget', {
                          initialValue: initData.authTarget,
                        })(<Select
                          multiple
                          disabled={getFieldValue('selectAll') === 1}
                        >
                          {
                            anchorList.map(item => (
                              <Option
                                key={item._id}
                                value={item.platformUserId}
                              >
                                {`${item.username}(id:${item.platformUserId})`}
                              </Option>
                            ))
                          }
                        </Select>)
                      }
                  </div>
                )
              }

              {operatorConfigError && <span className="form-error-tip">请至少选择一个权限</span>}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
