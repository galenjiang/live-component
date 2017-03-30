// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Row, Col, Input, Checkbox, message, Radio } from 'antd';
import _ from 'lodash';


// self components
import MonitorUrl from '../../../MonitorUrl';
import ImageUploadCustomed from '../../../ImageUploadCustomed';
import utils from '../../../../utils';
import style from '../style.M.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { event, reg, decorators: { formCreate }, validate } = utils;

@formCreate()
@CSSModule(style)
export default class MangoBarCode extends Component {
  static propsType = {
    data: PropTypes.object.isRequired,
  }

  constructor(props) {
    super();
    const { data } = props;

    const qrCodePageConfig = {
      slogan: '扫一扫二维码\n立即领取红包',
      minIcon: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/ads/redpacket/redpacket-logo.png', // 缩小图
      descriptionText: '淘宝或支付宝app，\n打开扫一扫立即领取', // 说明文字
    };

    const afterOpenConfig = {
      pic: 'http://static.cdn.videojj.com/FpMdcAlO2-fbx4mm09ZV2L34CO_6',
      link: '',
      monitorUrl: [],
    };

    this.state = {
      isColorPickerShow: false,
      data: {
        ..._.cloneDeep(data),
        ...{
          countDownText: '红包出现\n点击快抢',
          qrCodePage: _.defaults(data.qrCodePage, qrCodePageConfig),
          afterOpen: _.defaults(data.afterOpen, afterOpenConfig),
        },
      },
    };
  }


  componentDidMount() {
    const { form } = this.props;
    event.$on('validateFields', (callback) => {
      // before get monitorUrl value, clear array
      let monitorUrl = {};
      let monitorErr = null;
      event.$emit('validateMonitorUrl', (data) => {
        if (data instanceof Error) {
          monitorErr = data;
        }
        monitorUrl = {
          ...monitorUrl,
          ...data,
        };
      });

      form.validateFields((err, values) => {
        if (err) {
          return false;
        }

        if (monitorErr) return false;
        callback(values, monitorUrl);
      });
    });
  }


  componentWillUnmount() {
    event.$clear('validateFields');
  }


  render() {
    const { form, disabled } = this.props;
    const { data } = this.state;

    const prefix = 'redpacket-ads-resource';

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    };
    const notRequiredFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: false,
    };

    return (
      <div styleName={`${prefix}`}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="广告标题"
          >
            {
              form.getFieldDecorator('title', {
                initialValue: data.title,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '红包标题不能为空',
                }],
              })(<Input
                style={{ width: '320px' }}
                placeholder="请输入广告标题"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="热点图片"
          >
            <div style={{ width: '90px', height: '120px' }}>
              {
                form.getFieldDecorator('pic', {
                  valuePropName: 'fileURL',
                  trigger: 'onUploadChange',
                  initialValue: data.pic,
                  rules: [{
                    type: 'string',
                    pattern: reg.httpRegWithProtocol,
                    required: true,
                    message: '请上传热点图片',
                  }],
                })(<ImageUploadCustomed
                  axiosComtomed={this.props.axiosComtomed}
                  staticVideoJJAPI={this.props.staticVideoJJAPI}
                  qiniuUploadAPI={this.props.qiniuUploadAPI}
                  crop={false}
                  disabled={disabled}
                  cropOptions={{
                    aspect: 90 / 120,
                  }}
                />)
              }
            </div>
          </FormItem>
          <Row style={{ marginBottom: '15px' }}>
            <Col offset={6}>
              {
                form.getFieldDecorator('displayCountDown', {
                  valuePropName: 'checked',
                  initialValue: data.displayCountDown,
                  rules: [],
                })(<Checkbox
                  disabled={disabled}
                >
                  是否显示标语
                </Checkbox>)
              }
            </Col>
          </Row>
          {
            form.getFieldValue('displayCountDown')
            && <FormItem
              {...formItemLayout}
              label="热点标语"
            >
              {
                form.getFieldDecorator('countDownText', {
                  initialValue: data.countDownText,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '热点标语不能为空',
                  }, {
                    message: '热点标语不能大于8个字符',
                    validator(rule, value, callback) {
                      if (!validate.multiLineStringLimit(8)(value)) {
                        callback(rule.message);
                      } else {
                        callback();
                      }
                    },
                  }],
                })(<Input
                  disabled={disabled}
                  type="textarea"
                  placeholder="标语文本 共8个字符 一行4个字符"
                  autosize={{ minRows: 2, maxRows: 2 }}
                  style={{ width: '320px' }}
                />)
              }
            </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="监测代码"
          >
            <MonitorUrl
              disabled={disabled}
              ctx={'monitorUrl'}
              monitorUrlList={data.monitorUrl}
            />
          </FormItem>
          {/* 二维码页面 */}
          <FormItem
            {...formItemLayout}
            label="红包标题"
          >
            {
              form.getFieldDecorator('qrCodePage.slogan', {
                initialValue: data.qrCodePage.slogan,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '红包标题不能为空',
                }, {
                  message: '热点标语不能大于12个字符',
                  validator(rule, value, callback) {
                    if (!validate.multiLineStringLimit(12)(value)) {
                      callback(rule.message);
                    } else {
                      callback();
                    }
                  },
                }],
              })(<Input
                disabled={disabled}
                type="textarea"
                style={{ width: '320px' }}
                placeholder="请输入红包标题"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌LOGO"
          >
            <div
              style={{ width: '200px', height: `${(200 / 80) * 80}px` }}
            >
              {
                form.getFieldDecorator('qrCodePage.minIcon', {
                  valuePropName: 'fileURL',
                  trigger: 'onUploadChange',
                  initialValue: data.qrCodePage.minIcon,
                  rules: [{
                    type: 'string',
                    pattern: reg.httpRegWithProtocol,
                    required: true,
                    message: '请上传品牌LOGO',
                  }],
                })(<ImageUploadCustomed
                  axiosComtomed={this.props.axiosComtomed}
                  staticVideoJJAPI={this.props.staticVideoJJAPI}
                  qiniuUploadAPI={this.props.qiniuUploadAPI}
                  crop={false}
                  disabled={disabled}
                  cropOptions={{
                    aspect: 90 / 120,
                  }}
                />)
              }
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="领取介绍"
          >
            {
              form.getFieldDecorator('qrCodePage.descriptionText', {
                initialValue: data.qrCodePage.descriptionText,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '领取介绍不能为空',
                }, {
                  message: '领取介绍不能大于20个字符',
                  validator(rule, value, callback) {
                    if (!validate.multiLineStringLimit(20)(value)) {
                      callback(rule.message);
                    } else {
                      callback();
                    }
                  },
                }],
              })(<Input
                disabled={disabled}
                type="textarea"
                autosize={{ minRows: 2, maxRows: 2 }}
                style={{ width: '320px' }}
                placeholder="请输入领取介绍"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="红包链接"
          >
            {
              form.getFieldDecorator('webUrl', {
                initialValue: data.webUrl,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '红包链接不能为空',
                }, {
                  pattern: reg.httpRegWithProtocol,
                  message: '红包链接不合法',
                }],
              })(<Input
                disabled={disabled}
                placeholder="请输入红包链接"
              />)
            }
          </FormItem>

          {/* 打开后广告页面 */}
          <FormItem
            {...formItemLayout}
            label="广告图片"
          >
            <div style={{ width: '200px', height: `${(200 / 150) * 150}px` }}>
              {
                form.getFieldDecorator('afterOpen.pic', {
                  valuePropName: 'fileURL',
                  trigger: 'onUploadChange',
                  initialValue: data.afterOpen.pic,
                  rules: [{
                    type: 'string',
                    required: true,
                    pattern: reg.httpRegWithProtocol,
                    message: '请上传广告图片',
                  }],
                })(<ImageUploadCustomed
                  axiosComtomed={this.props.axiosComtomed}
                  staticVideoJJAPI={this.props.staticVideoJJAPI}
                  qiniuUploadAPI={this.props.qiniuUploadAPI}
                  crop={false}
                  disabled={disabled}
                  cropOptions={{
                    aspect: 150 / 150,
                  }}
                />)
              }
            </div>
          </FormItem>
          <FormItem
            {...notRequiredFormItemLayout}
            label="广告外链"
          >
            {
              form.getFieldDecorator('afterOpen.link', {
                initialValue: data.afterOpen.link,
                rules: [{
                  type: 'string',
                  pattern: reg.httpRegWithProtocol,
                  message: '广告外链不合法',
                }],
              })(<Input
                placeholder="请输入广告外链"
                disabled={disabled}
              />)
            }
          </FormItem>
          <FormItem
            {...notRequiredFormItemLayout}
            label="监测代码"
          >
            <MonitorUrl
              disabled={disabled}
              ctx={'afterOpen.monitorUrl'}
              monitorUrlList={data.afterOpen.monitorUrl}
            />
          </FormItem>
        </Form>
      </div>
    );
  }
}
