// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Row, Col, Input, Checkbox, message, Upload, Button, Icon, Tooltip } from 'antd';
import _ from 'lodash';


// self components
import MonitorUrl from '../../../MonitorUrl';
import ImageUploadCustomed from '../../../ImageUploadCustomed';
import utils from '../../../../utils';
import style from '../style.M.less';

const FormItem = Form.Item;
const { event, reg, decorators: { formCreate }, validate } = utils;

@formCreate()
@CSSModule(style)
export default class PromoCodePacket extends Component {
  static propsType = {
    isCreateBall: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super();
    const { data } = props;
    const promoCodePageConfig = {
      slogan: '', // 红包顶部标题
      background: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/ads/redpacket/redpacket-background.png', // 红包背景图片
      miniLogo: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/ads/redpacket/redpacket-logo.png', // 红包logo小图
      content: '', // 红包内容
      amount: '',   // 红包金额
      completeText: '',   //  领完内容
      receiveFinishText: '',   // 完成内容
      btnText: '', // 按钮文字
      bannerPic: '', // 广告banner图片
      bannerLink: '', // 广告banner外链
      exchangeText: '', // 兑换说明
      monitorUrl: [],
      // uploadFile: null,
    };

    // if (isCreateBall) {
    //   this.state = {
    //     data: {
    //       ...data,
    //       pic: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/ads/redpacket/redpacket-tag.png',
    //       promoCodePage: {
    //         ...modelConfig,
    //         ...data.promoCodePage
    //       },
    //     }
    //   }
    // } else {
    //   this.state = {
    //     data: {
    //       ...data,
    //       promoCodePage: {
    //         ...modelConfig,
    //         ...data.promoCodePage
    //       },
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
          promoCodePage: _.defaults(data.promoCodePage, promoCodePageConfig),
        },
      },
    };
  }

  componentDidMount() {
    const { form } = this.props;
    const { data } = this.state;
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

        let formData = null;
        if (_.isUndefined(data.promoCodePage.hadPromoCode || data.promoCodePage.promoCodeNum === 0) && !this.promoCode) {
          message.error('请上传优惠码配置文件');
          return false;
        } else if (this.promoCode) {
          formData = new FormData();
          formData.append('promo_code', this.promoCode);
        }

        callback(values, monitorUrl, formData);
      });
    });
  }


  componentWillUnmount() {
    event.$clear('validateFields');
  }



  uploadFile = (info) => {
    if (!(/\.csv$/.test(info.name) || /\.txt/.test(info.name))) {
      message.error('优惠码必须为txt或者csv格式，详情见下载示例');
      return false;
    }
    this.promoCode = info;
    this.setState({});

    return false;
  }

  render() {
    const { form, disabled } = this.props;
    const { data } = this.state;
    const { uploadFile } = this;
    const prefix = 'redpacket-ads-resource';

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    };

    const notRequiredFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const upoloadConfig = {
      beforeUpload: uploadFile,
      accept: '.txt,.csv',
    };

    return (
      <div styleName={`${prefix}`}>
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
            label="顶部标题"
          >
            {
              form.getFieldDecorator('promoCodePage.slogan', {
                initialValue: data.promoCodePage.slogan,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '顶部标题不能为空',
                }, {
                  max: 8,
                  message: '顶部标题不能大于8个字符',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入顶部标题"
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
                    form.getFieldDecorator('promoCodePage.background', {
                      valuePropName: 'fileURL',
                      trigger: 'onUploadChange',
                      initialValue: data.promoCodePage.background,
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
                      height: `${(200 * 120) / 120}px`,
                    }}
                  >
                    {
                      form.getFieldDecorator('promoCodePage.miniLogo', {
                        valuePropName: 'fileURL',
                        trigger: 'onUploadChange',
                        initialValue: data.promoCodePage.miniLogo,
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
            label="红包标题"
          >
            {
              form.getFieldDecorator('promoCodePage.content', {
                initialValue: data.promoCodePage.content,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '红包标题不能为空',
                }, {
                  max: 12,
                  message: '热点标语不能大于12个字符',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入红包标题, 最多12个字符"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="红包内容"
          >
            {
              form.getFieldDecorator('promoCodePage.amount', {
                initialValue: data.promoCodePage.amount,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '红包内容不能为空',
                }, {
                  max: 8,
                  message: '红包内容不能大于8个字符',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入红包内容"
              />)
            }
          </FormItem>
          <FormItem
            {...notRequiredFormItemLayout}
            label="结束提示"
          >
            {
              form.getFieldDecorator('promoCodePage.receiveFinishText', {
                initialValue: data.promoCodePage.receiveFinishText,
                rules: [{
                  type: 'string',
                  message: '结束提示不能大于20个字符',
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
                placeholder="请输入结束提示"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="领完优惠码提示"
          >
            {
              form.getFieldDecorator('promoCodePage.completeText', {
                initialValue: data.promoCodePage.completeText,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '领完优惠码不能为空',
                }, {
                  message: '领完优惠码提示不能大于20个字符',
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
                placeholder="请输入领完优惠码提示"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="按钮文字"
          >
            {
              form.getFieldDecorator('promoCodePage.btnText', {
                initialValue: data.promoCodePage.btnText,
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
            {...notRequiredFormItemLayout}
            label="兑换说明"
          >
            {
              form.getFieldDecorator('promoCodePage.exchangeText', {
                initialValue: data.promoCodePage.exchangeText,
                rules: [{
                  type: 'string',
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
                form.getFieldDecorator('promoCodePage.bannerPic', {
                  valuePropName: 'fileURL',
                  trigger: 'onUploadChange',
                  initialValue: data.promoCodePage.bannerPic,
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
              form.getFieldDecorator('promoCodePage.bannerLink', {
                initialValue: data.promoCodePage.bannerLink,
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
              ctx={'promoCodePage.monitorUrl'}
              disabled={disabled}
              monitorUrlList={data.promoCodePage.monitorUrl}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="优惠码配置上传"
          >
            <Col span={5}>
              <Upload {...upoloadConfig}>
                <Button
                  type="ghost"
                  disabled={disabled}
                >
                  <Icon type="upload" />
                  {(this.promoCode && this.promoCode.name) || '点击上传'}
                </Button>
              </Upload>
            </Col>
            <Col span={5}>
              <a
                download={'sample.txt'}
                href="http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/assets/sample.txt"
              >
                <Button>
                  <Icon type="download" />
                  下载示例
                </Button>
              </a>
            </Col>
            <Col span={1}>
              <Tooltip
                title="上传优惠码以换行隔开，发放顺序:从下往上依次发放，为16字符以内的英文、数字组成"
              >
                <Icon type="question-circle" />
              </Tooltip>
            </Col>
            {
              _.isNumber(data.promoCodePage.promoCodeNum)
              && <span>还剩下{data.promoCodePage.promoCodeNum}个优惠码</span>
            }
          </FormItem>
        </Form>
      </div>
    );
  }
}

