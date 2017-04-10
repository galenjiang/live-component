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
export default class PasswordPacket extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  constructor(props) {
    super();
    const { data } = props;
    const passwordPageConfig = {
      slogan: '', // 红包标语
      background: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/ads/redpacket/redpacket-background.png', // 红包背景图片
      miniLogo: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/ads/redpacket/redpacket-logo.png', // 红包logo小图
      password: '', // 红包口令
      btnText: '', // 按钮文字
      bannerPic: '', // 广告banner图片
      bannerLink: '', // 广告banner外链
      exchangeText: '', // 兑换说明
      monitorUrl: [],
    };

    // if (isCreateBall) {
    //   this.state = {
    //     data: {
    //       ...data,
    //       pic: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/ads/redpacket/redpacket-tag.png',
    //       passwordPage: {
    //         ...modelConfig,
    //         ...data.passwordPage
    //       }
    //     }
    //   }
    // } else {
    //   this.state = {
    //     data: {
    //       ...data,
    //       passwordPage: {
    //         ...modelConfig,
    //         ...data.passwordPage
    //       }
    //     }
    //   }
    // }

    this.state = {
      data: {
        ..._.defaults(data, {
          pic: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/ads/redpacket/redpacket-tag.png',
          countDownText: '红包出现\n点击快抢',
        }),
        ...{
          passwordPage: _.defaults(data.passwordPage, passwordPageConfig),
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
      <div className={`${prefix}`}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="标题"
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
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入广告标题"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="热点图片"
          >
            <div style={{ width: '200px', height: '150px' }}>

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
          <FormItem
            {...notRequiredFormItemLayout}
            label="监测代码"
          >
            <MonitorUrl
              ctx={'monitorUrl'}
              disabled={disabled}
              monitorUrlList={data.monitorUrl}
            />
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
                  是否显示提示标语
                </Checkbox>)
              }
            </Col>
          </Row>
          {
            form.getFieldValue('displayCountDown')
            && <FormItem
              {...notRequiredFormItemLayout}
              label="提示标语文本"
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
                  placeholder="提示标语文本 共8个字符 一行4个字符"
                  autosize={{ minRows: 2, maxRows: 2 }}
                  style={{ width: '320px' }}
                />)
              }
            </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="红包标题"
          >
            {
              form.getFieldDecorator('passwordPage.slogan', {
                initialValue: data.passwordPage.slogan,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '红包标题不能为空',
                }, {
                  max: 8,
                  message: '红包标题不能大于8个字符',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入红包标题"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="红包背景图片"
          >
            <Row style={{ marginBottom: '15px' }}>
              <Col span={8}>
                <div
                  style={{
                    width: '200px',
                    height: `${(200 / 210) * 370}px`,
                  }}
                >
                  {
                    form.getFieldDecorator('passwordPage.background', {
                      valuePropName: 'fileURL',
                      trigger: 'onUploadChange',
                      initialValue: data.passwordPage.background,
                      rules: [{
                        type: 'string',
                        pattern: reg.httpRegWithProtocol,
                        required: true,
                        message: '请上传红包背景图片',
                      }],
                    })(<ImageUploadCustomed
                      axiosComtomed={this.props.axiosComtomed}
                      staticVideoJJAPI={this.props.staticVideoJJAPI}
                      qiniuUploadAPI={this.props.qiniuUploadAPI}
                      crop
                      disabled={disabled}
                      cropOptions={{
                        aspect: 210 / 370,
                      }}
                    />)
                  }
                </div>
              </Col>
              <Col span={16}>
                <FormItem
                  {...formItemLayout}
                  label="品牌LOGO小图"
                >
                  <div
                    style={{
                      width: '200px',
                      height: `${(200 / 120) * 120}px`,
                    }}
                  >
                    {
                      form.getFieldDecorator('passwordPage.miniLogo', {
                        valuePropName: 'fileURL',
                        trigger: 'onUploadChange',
                        initialValue: data.passwordPage.miniLogo,
                        rules: [{
                          type: 'string',
                          pattern: reg.httpRegWithProtocol,
                          required: true,
                          message: '请上传品牌LOGO小图',
                        }],
                      })(<ImageUploadCustomed
                        axiosComtomed={this.props.axiosComtomed}
                        staticVideoJJAPI={this.props.staticVideoJJAPI}
                        qiniuUploadAPI={this.props.qiniuUploadAPI}
                        crop
                        disabled={disabled}
                        cropOptions={{
                          aspect: 120 / 120,
                        }}
                      />)
                    }
                  </div>
                </FormItem>
              </Col>
            </Row>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="红包口令"
          >
            {
              form.getFieldDecorator('passwordPage.password', {
                initialValue: data.passwordPage.password,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '红包口令不能为空',
                }, {
                  message: '红包口令不能大于20个字符',
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
                placeholder="请输入红包口令"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="按钮文字"
          >
            {
              form.getFieldDecorator('passwordPage.btnText', {
                initialValue: data.passwordPage.btnText,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '按钮文字不能为空',
                }, {
                  max: 8,
                  message: '按钮文字不能大于8个字符',
                }],
              })(<Input
                disabled={disabled}
                placeholder="请输入按钮文字"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="兑换说明"
          >
            {
              form.getFieldDecorator('passwordPage.exchangeText', {
                initialValue: data.passwordPage.exchangeText,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '兑换说明不能为空',
                }, {
                  message: '兑换说明不能大于20个字符',
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
                placeholder="请输入兑换说明"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="广告banner图片"
          >
            <div
              style={{
                width: '500px',
                height: `${(500 / 500) * 150}px`,
              }}
            >
              {
                form.getFieldDecorator('passwordPage.bannerPic', {
                  valuePropName: 'fileURL',
                  trigger: 'onUploadChange',
                  initialValue: data.passwordPage.bannerPic,
                  rules: [{
                    type: 'string',
                    required: true,
                    pattern: reg.httpRegWithProtocol,
                    message: '请上传广告banner图片',
                  }],
                })(<ImageUploadCustomed
                  axiosComtomed={this.props.axiosComtomed}
                  staticVideoJJAPI={this.props.staticVideoJJAPI}
                  qiniuUploadAPI={this.props.qiniuUploadAPI}
                  crop
                  disabled={disabled}
                  cropOptions={{
                    aspect: 500 / 150,
                  }}
                />)
              }
            </div>
          </FormItem>
          <FormItem
            {...notRequiredFormItemLayout}
            label="广告banner外链"
          >
            {
              form.getFieldDecorator('passwordPage.bannerLink', {
                initialValue: data.passwordPage.bannerLink,
                rules: [{
                  type: 'string',
                  pattern: reg.httpRegWithProtocol,
                  message: '广告banner外链不合法',
                }],
              })(<Input
                disabled={disabled}
                placeholder="请输入广告banner外链"
              />)
            }
          </FormItem>
          <FormItem
            {...notRequiredFormItemLayout}
            label="监测代码"
          >
            <MonitorUrl
              ctx={'passwordPage.monitorUrl'}
              disabled={disabled}
              monitorUrlList={data.passwordPage.monitorUrl}
            />
          </FormItem>
        </Form>
      </div>
    );
  }
}
