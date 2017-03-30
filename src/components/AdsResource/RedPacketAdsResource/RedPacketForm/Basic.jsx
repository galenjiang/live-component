// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Row, Col, InputNumber, Input, Checkbox, message, Radio } from 'antd';
import { ChromePicker } from 'react-color';
import _ from 'lodash';


// self components
import MonitorUrl from '../../../MonitorUrl';
import ImageUploadCustomed from '../../../ImageUploadCustomed';
import utils from '../../../../utils';
import style from '../style.M.less';

// import { multiLineStringLimit } from '../../../libs/utils/util'
// import hexToRgb from '../../../libs/utils/hex2rgb'


const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { event, reg, decorators: { formCreate }, validate } = utils;

@formCreate()
@CSSModule(style)
export default class ModalAdRedPackets extends Component {
  constructor(props) {
    super();
    const data = _.cloneDeep(props.data);
    const qrCodePageConfig = {
      slogan: '',
      background: 'https://sdkcdn.videojj.com/images/web/live/ads/redpacket/qrcode-background.png', // 背景图
      customQrCode: false, // 是否自定义二维码
      qrCode: '', // 二维码图片
      autoOpen: 15,
      minIcon: 'https://sdkcdn.videojj.com/images/web/live/ads/redpacket/qrcode-redpacket-small.png', // 缩小图
      narrowBtnColor: '#cccccc', // 缩进按钮颜色
      descOption: 0, // 描述 0-说明配图 1-说明文字 默认为0
      descriptionImg: 'https://sdkcdn.videojj.com/images/web/live/ads/redpacket/qrcode-description-picture.png', // 说明配图
      descriptionText: '', // 说明文字
    };
    const afterOpenConfig = {
      title: '',
      slogan: '',
      background: 'https://sdkcdn.videojj.com/images/web/live/ads/redpacket/afteropen-background.png',
      pic: 'http://static.cdn.videojj.com/FpMdcAlO2-fbx4mm09ZV2L34CO_6',
      link: '',
      btnLabel: '',
      monitorUrl: [],
    };

    this.state = {
      isColorPickerShow: false,
      data: {
        ..._.cloneDeep(data),
        ...{
          qrCodePage: _.defaults(data.qrCodePage, qrCodePageConfig),
          afterOpen: _.defaults(data.afterOpen, afterOpenConfig),
        },
      },
    };


    // isColorPickerShow: false,
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

    /**
   * 设置颜色
   * @param color
   */
  changeColorPicker = (color) => {
    const { form } = this.props;
    form.setFieldsValue({ 'qrCodePage.narrowBtnColor': color.hex });
  }

  /**
   * 开关颜色按钮
   */
  toggleColorPicker = (e) => {
    const { isColorPickerShow } = this.state;
    this.setState({
      isColorPickerShow: !isColorPickerShow,
    });
    return false;
  }

  /**
   * discard
   * @param e
   */
  closeColorPicker = (e) => {
    if (!this.colorPicker.contains(e.target)) {
      this.setState({
        isColorPickerShow: false,
      });
    }
  }

  render() {
    const { form, disabled } = this.props;
    const { data, isColorPickerShow } = this.state;
    const { toggleColorPicker, closeColorPicker, changeColorPicker } = this;

    const prefix = 'redpacket-ads-resource';

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    };
    const formItemLayoutNotRequired = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: false,
    };

    // let hexColor = getFieldValue('qrCodePage.narrowBtnColor');
    // let rgbcolor = this.__revertColor(hexColor);
    return (
      <div
        styleName={`${prefix}`}
        onClick={closeColorPicker}
      >
        <Form>
          <Row>
            <Col push={4} pull={4}>

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
                    placeholder="红包广告标题"
                    style={{ width: '250px' }}
                  />)
                }
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="热点图片"
              >
                <div style={{ height: '200px', width: '125px' }}>
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
                      disabled={disabled}
                      crop={false}
                      cropOptions={{
                        aspect: 1,
                      }}
                      axiosComtomed={this.props.axiosComtomed}
                      staticVideoJJAPI={this.props.staticVideoJJAPI}
                      qiniuUploadAPI={this.props.qiniuUploadAPI}
                    />)
                  }
                </div>
              </FormItem>
              <div styleName={`${prefix}-checkbox`}>
                <Row>
                  <Col span={18} offset={6}>
                    {
                      form.getFieldDecorator('displayCountDown', {
                        valuePropName: 'checked',
                        initialValue: data.displayCountDown,
                        rules: [{
                        }],
                      })(<Checkbox
                        disabled={disabled}
                      >
                        是否需要倒计时
                      </Checkbox>)
                    }
                  </Col>
                </Row>
              </div>
              {
                form.getFieldValue('displayCountDown')
                && <FormItem
                  {...formItemLayoutNotRequired}
                  label="倒计时文本"
                >
                  {
                    form.getFieldDecorator('countDownText', {
                      valuePropName: 'checked',
                      initialValue: data.countDownText,
                      rules: [{
                        message: '输入的文字只能包含10个字符',
                        validator(rule, value, callback) {
                          if (!validate.multiLineStringLimit(10)(value)) {
                            callback(rule.message);
                          } else {
                            callback();
                          }
                        },
                      }],
                    })(<Input
                      disabled={disabled}
                      placeholder="倒计时文本， 共10个中文， 一行5个"
                      type="textarea"
                      autosize={{ minRows: 2, maxRows: 2 }}
                    />)
                  }
                </FormItem>
              }
              <FormItem
                {...formItemLayout}
                label="WEB落地页配置"
              >
                {
                  form.getFieldDecorator('webUrl', {
                    initialValue: data.webUrl,
                    rules: [{
                      type: 'string',
                      required: true,
                      message: 'WEB落地页不能为空',
                    }, {
                      pattern: reg.httpRegWithProtocol,
                      message: 'WEB落地页配置不合法',
                    }],
                  })(<Input
                    disabled={disabled}
                    placeholder="WEB落地页配置地址"
                  />)
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="移动端落地页配置"
              >
                {
                  form.getFieldDecorator('mobileUrl', {
                    initialValue: data.mobileUrl,
                    rules: [{
                      type: 'string',
                      required: true,
                      message: '移动端落地页不能为空',
                    }, {
                      pattern: reg.httpRegWithProtocol,
                      message: '移动端落地页配置不合法',
                    }],
                  })(<Input
                    disabled={disabled}
                    placeholder="请输入移动端落地页配置地址"
                  />)
                }
              </FormItem>
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
            </Col>
          </Row>
          <p styleName={`${prefix}-specific-line`}>
            <span>红包二维码页面广告设置</span>
          </p>
          <FormItem
            {...formItemLayout}
            label="红包标语"
          >
            {
              form.getFieldDecorator('qrCodePage.slogan', {
                initialValue: data.qrCodePage.slogan,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '红包标语不能为空',
                }],
              })(<Input
                disabled={disabled}
                placeholder="请输入红包标语，共两行"
                type="textarea"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="广告背景图片"
          >
            <Row>
              <Col span={10}>
                <div style={{ height: '150px', width: `${((150 / 3) * 5)}px` }}>
                  {
                    form.getFieldDecorator('qrCodePage.background', {
                      valuePropName: 'fileURL',
                      trigger: 'onUploadChange',
                      initialValue: data.qrCodePage.background,
                      rules: [{
                        type: 'string',
                        pattern: reg.httpRegWithProtocol,
                        required: true,
                        message: '请上传广告背景图片图片',
                      }],
                    })(<ImageUploadCustomed
                      disabled={disabled}
                      crop
                      cropOptions={{ aspect: 3 / 5 }}
                      axiosComtomed={this.props.axiosComtomed}
                      staticVideoJJAPI={this.props.staticVideoJJAPI}
                      qiniuUploadAPI={this.props.qiniuUploadAPI}
                    />)
                  }
                </div>
              </Col>
              <Col span={14}>
                <Row>
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="缩进按钮颜色"
                  >
                    <div
                      ref={(colorPicker) => { this.colorPicker = colorPicker; }}
                    >
                      <div styleName={`${prefix}-color-input`}>
                        {
                          form.getFieldDecorator('qrCodePage.narrowBtnColor', {
                            initialValue: data.qrCodePage.narrowBtnColor,
                          })(<Input />)
                        }
                      </div>
                      <span
                        styleName={`${prefix}-color-btn`}
                        style={{
                          backgroundColor: form.getFieldValue('qrCodePage.narrowBtnColor'),
                          // color: `rgb(${rgbcolor[0]}, ${rgbcolor[1]}, ${rgbcolor[2]})`
                        }}
                        onClick={toggleColorPicker}
                      >
                        按钮颜色
                      </span>
                      <div styleName={`${prefix}-color-picker`}>
                        {
                          isColorPickerShow
                          && <ChromePicker
                            color={form.getFieldValue('qrCodePage.narrowBtnColor')}
                            onChangeComplete={changeColorPicker}
                          />
                        }
                      </div>
                    </div>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="红包缩小小图"
                  >
                    <div style={{ height: '150px', width: `${((150 / 8) * 9)}px` }}>
                      {
                        form.getFieldDecorator('qrCodePage.minIcon', {
                          valuePropName: 'fileURL',
                          trigger: 'onUploadChange',
                          initialValue: data.qrCodePage.minIcon,
                          rules: [{
                            type: 'string',
                            pattern: reg.httpRegWithProtocol,
                            required: true,
                            message: '请上传红包缩小图',
                          }],
                        })(<ImageUploadCustomed
                          disabled={disabled}
                          crop
                          cropOptions={{ aspect: 3 / 5 }}
                          axiosComtomed={this.props.axiosComtomed}
                          staticVideoJJAPI={this.props.staticVideoJJAPI}
                          qiniuUploadAPI={this.props.qiniuUploadAPI}
                        />)
                      }
                    </div>
                  </FormItem>
                </Row>

              </Col>
            </Row>
          </FormItem>

          <div styleName={`${prefix}-checkbox`}>
            <Row>
              <Col span={17} push={6}>
                <FormItem>
                  {
                    form.getFieldDecorator('qrCodePage.customQrCode', {
                      valuePropName: 'checked',
                      initialValue: data.qrCodePage.customQrCode,
                      rules: [],
                    })(<Checkbox
                      disabled={disabled}
                    >
                      是否自定义二维码
                    </Checkbox>)
                  }
                </FormItem>
              </Col>
            </Row>
          </div>
          {
            form.getFieldValue('qrCodePage.customQrCode')
            && (
              <FormItem
                {...formItemLayoutNotRequired}
                label="自定义二维码"
              >
                <div
                  style={{ width: '200px', height: '200px' }}
                >
                  {
                    form.getFieldDecorator('qrCodePage.qrCode', {
                      valuePropName: 'fileURL',
                      trigger: 'onUploadChange',
                      initialValue: data.qrCodePage.qrCode,
                      rules: [{
                        type: 'string',
                        required: true,
                        pattern: reg.httpRegWithProtocol,
                        message: '请上传自定义二维码',
                      }],
                    })(<ImageUploadCustomed
                      disabled={disabled}
                      crop={false}
                      cropOptions={{ aspect: 1 }}
                      axiosComtomed={this.props.axiosComtomed}
                      staticVideoJJAPI={this.props.staticVideoJJAPI}
                      qiniuUploadAPI={this.props.qiniuUploadAPI}
                    />)
                  }
                </div>
              </FormItem>
            )
          }
          {
            form.getFieldValue('qrCodePage.customQrCode')
            && (
              <FormItem
                {...formItemLayoutNotRequired}
                label="红包自动打开时间"
              >
                {
                  form.getFieldDecorator('qrCodePage.autoOpen', {
                    initialValue: data.qrCodePage.autoOpen,
                    rules: [{
                      type: 'number',
                      required: true,
                      message: '红包自动打开时间不合法',
                    }],
                  })(<InputNumber
                    disabled={disabled}
                    min={1}
                  />)
                }
                &nbsp;秒
              </FormItem>
            )
          }
          <div styleName={`${prefix}-radio`}>
            <Row>
              <Col span={18} push={6}>
                {
                  form.getFieldDecorator('qrCodePage.descOption', {
                    initialValue: data.qrCodePage.descOption,
                    rules: [],
                  })(<RadioGroup
                    disabled={disabled}
                  >
                    <Radio key="a" value={0}>使用图片说明</Radio>
                    <Radio key="b" value={1}>使用文字说明</Radio>
                  </RadioGroup>)
                }
              </Col>
            </Row>
          </div>
          {
            form.getFieldValue('qrCodePage.descOption') === 0
            && <FormItem
              {...formItemLayout}
              label="图片说明"
            >
              <div
                styleName={`${prefix}-description-img`}
                style={{ width: '150px', height: '100px', backgroundColor: '#6c726c' }}
              >
                {
                  form.getFieldDecorator('qrCodePage.descriptionImg', {
                    valuePropName: 'fileURL',
                    trigger: 'onUploadChange',
                    initialValue: data.qrCodePage.descriptionImg,
                    rules: [{
                      type: 'string',
                      required: true,
                      pattern: reg.httpRegWithProtocol,
                      message: '请上传图片说明',
                    }],
                  })(<ImageUploadCustomed
                    axiosComtomed={this.props.axiosComtomed}
                    staticVideoJJAPI={this.props.staticVideoJJAPI}
                    qiniuUploadAPI={this.props.qiniuUploadAPI}
                    disabled={disabled}
                    crop
                    cropOptions={{ aspect: 6 / 4 }}
                  />)
                }
              </div>
            </FormItem>
          }
          {
            form.getFieldValue('qrCodePage.descOption') === 1
            && <FormItem
              {...formItemLayout}
              label="红包说明"
            >
              {
                form.getFieldDecorator('qrCodePage.descriptionText', {
                  initialValue: data.qrCodePage.descriptionText,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '红包说明不能为空',
                  }, {
                    message: '红包说明不能超过20个字符',
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
                  placeholder="红包说明共2行 最多20个中文字"
                  type="textarea"
                  autosize={{ minRows: 2, maxRows: 2 }}
                />)
              }
            </FormItem>
          }

          <p styleName={`${prefix}-specific-line`}>
            <span>红包领取成功后广告设置</span>
          </p>
          <Row>
            <Col>
              <FormItem
                {...formItemLayoutNotRequired}
                label="广告标题"
              >
                {
                  form.getFieldDecorator('afterOpen.title', {
                    initialValue: data.afterOpen.title,
                    rules: [],
                  })(<Input
                    disabled={disabled}
                    placeholder="请输入广告标题"
                    style={{ width: '250px' }}
                  />)
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="广告slogan"
              >
                {
                  form.getFieldDecorator('afterOpen.slogan', {
                    initialValue: data.afterOpen.slogan,
                    rules: [{
                      type: 'string',
                      required: true,
                      message: '广告slogan不能为空',
                    }, {
                      message: '广告slogan不能大于20个字符',
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
                    placeholder="请输入广告slogan，共两行，不多于20个字符"
                    type="textarea"
                  />)
                }
              </FormItem>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...{
                      labelCol: { span: 12 },
                      wrapperCol: { span: 12 },
                      required: true,
                    }}
                    label="广告背景图片"
                  >
                    <div style={{ width: '120px', height: '200px' }}>
                      {
                        form.getFieldDecorator('afterOpen.background', {
                          valuePropName: 'fileURL',
                          trigger: 'onUploadChange',
                          initialValue: data.afterOpen.background,
                          rules: [{
                            type: 'string',
                            required: true,
                            pattern: reg.httpRegWithProtocol,
                            message: '请上传广告背景图片',
                          }],
                        })(<ImageUploadCustomed
                          axiosComtomed={this.props.axiosComtomed}
                          staticVideoJJAPI={this.props.staticVideoJJAPI}
                          qiniuUploadAPI={this.props.qiniuUploadAPI}
                          crop
                          disabled={disabled}
                          cropOptions={{ aspect: 3 / 5 }}
                        />)
                      }
                    </div>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...{
                      labelCol: { span: 6 },
                      wrapperCol: { span: 18 },
                      required: true,
                    }}
                    label="广告展示图片"
                  >
                    <div style={{ width: '240px', height: '200px' }}>
                      {
                        form.getFieldDecorator('afterOpen.pic', {
                          valuePropName: 'fileURL',
                          trigger: 'onUploadChange',
                          initialValue: data.afterOpen.pic,
                          rules: [{
                            type: 'string',
                            required: true,
                            pattern: reg.httpRegWithProtocol,
                            message: '请上传广告展示图片',
                          }],
                        })(<ImageUploadCustomed
                          axiosComtomed={this.props.axiosComtomed}
                          staticVideoJJAPI={this.props.staticVideoJJAPI}
                          qiniuUploadAPI={this.props.qiniuUploadAPI}
                          crop
                          disabled={disabled}
                          cropOptions={{ aspect: 6 / 5 }}
                        />)
                      }
                    </div>
                  </FormItem>
                </Col>
              </Row>
              <FormItem
                {...formItemLayout}
                label="广告链接"
              >
                {
                  form.getFieldDecorator('afterOpen.link', {
                    initialValue: data.afterOpen.link,
                    rules: [{
                      type: 'string',
                      required: true,
                      message: '广告链接不能为空',
                    }, {
                      pattern: reg.httpRegWithProtocol,
                      message: '广告链接输入不正确',
                    }],
                  })(<Input
                    placeholder="广告链接"
                    disabled={disabled}
                  />)
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="监测代码"
              >
                <MonitorUrl
                  disabled={disabled}
                  ctx={'afterOpen.monitorUrl'}
                  monitorUrlList={data.afterOpen.monitorUrl}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="按钮文字"
              >
                {
                  form.getFieldDecorator('afterOpen.btnLabel', {
                    initialValue: data.afterOpen.btnLabel,
                    rules: [{
                      type: 'string',
                      required: true,
                      message: '按钮文字不能为空',
                    }],
                  })(<Input
                    disabled={disabled}
                    placeholder="请输入按钮文字"
                    style={{ width: '250px' }}
                  />)
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
