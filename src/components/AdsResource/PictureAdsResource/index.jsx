// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// Third-part
import { Form, Row, Col, Input, message, Radio, Select } from 'antd';
import _ from 'lodash';

// mine
import ResourceModal from '../../ResourceModal';
import ImageUploadCustomed from '../../ImageUploadCustomed';
import MonitorUrl from '../../MonitorUrl';
import config from './config';
import utils from '../../../utils';
import style from './style.M.less';


const { event, reg, decorators: { formCreate } } = utils;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@formCreate()
@CSSModule(style)
export default class PictureAdsResource extends Component {
  constructor(props) {
    super();

    const { data } = props;

    // data.webSideBar = _.get(data.webSideBar, '_id', '');
    // data.mobileSideBar = _.get(data.mobileSideBar, '_id', '');
    // 初始化
    const modelConfig = {
      __t: 'PicAds',
      style: 0,
      title: '',
      webLinkOption: 0,
      url: '',
      webSideBar: _.get(props.sidebarAdsList, '[0]._id', ''),
      mobileLinkOption: 0,
      mobileUrl: '',
      mobileSideBar: _.get(props.sidebarAdsList, '[0]._id', ''),
      desc: '',
      pic: '',
      monitorUrl: [
        ['all', 'click', 'http://www.baidu.com', true],
      ],
    };



    this.state = {
      loading: false,
      data: _.defaults(data, modelConfig),
    };
  }

  onOk = () => {
    const { form, onOk } = this.props;
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

      // values, monitorUrl

      _(monitorUrl).forEach((item, key) => {
        const monitor = _(item)
          .map(el => ({
            [el[0]]: {
              [el[1]]: el[2],
            },
            admaster: el[3],
          }))
          .value();
        _.set(values, key, monitor);
      });

      onOk({
        ...this.state.data,
        ...values,
      });
    });


    // 开始验证规则
    // const data = _.cloneDeep(this.state.data)

    // let result = validate(data, _.find(pictureConfig, item => item.style === data.style).validate)

    // if (!result.res) {
    //   let stackList = result.stack
    //   message.error(`${stackList[stackList.length - 1].key}${stackList[stackList.length - 1].error}`)
    //   return false
    // }

    // if (data.webLinkOption === 0) {
    //   if (!commonHttpRegNotRequired.test(data.url)) {
    //     message.error('图片广告配置错误:请正确填写广告web链接')
    //     return false
    //   }
    // } else {
    //   if (!data.webSideBar) {
    //     message.error('图片广告配置错误:请填写广告web链接')
    //     return false
    //   }
    // }

    // if (data.mobileLinkOption === 0) {
    //   if (!commonHttpRegNotRequired.test(data.mobileUrl)) {
    //     message.error('图片广告配置错误:请正确填写广告mobile链接')
    //     return false
    //   }
    // } else {
    //   if (!data.mobileSideBar) {
    //     message.error('图片广告配置错误:请填写广告mobile链接')
    //     return false
    //   }
    // }

    // if (!monitorUrlValidate(data.monitorUrl, '图片广告')) {
    //   return false
    // }

    // //开始上传数据
    // let { onOk } = this.props
    // this.setState({
    //   loading: true
    // }, async() => {
    //   try {
    //     await onOk(data)
    //   } catch ( e ) {
    //     this.setState({
    //       loading: false
    //     })
    //   }

    // })
  }

  /**
   * skin change
   * @param index
   * @private
   */
  onSkinChange = (index) => {
    const { data } = this.state;
    data.style = config[index].style;
    this.setState({ data });
  }

  render() {
    const { onCancel, isCreated, sidebarAdsList, form, disabled } = this.props;
    const { loading, data } = this.state;
    const { onSkinChange, onOk } = this;

    const modalProps = {
      disabled,
      isCreated,
      title: _.find(config, item => item.style === data.style).type,
      skinTypeList: config,
      skin: _.findIndex(config, item => item.style === data.style),
      onSkinChange,
      onOk,
      onCancel,
      loading,
    };

    const prefix = 'picture-ads-resource';


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

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <ResourceModal
        {...modalProps}
      >
        <div styleName={prefix}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="图片"
            >
              <div
                style={{ width: '200px', height: '150px' }}
              >
                {
                  form.getFieldDecorator('pic', {
                    valuePropName: 'fileURL',
                    trigger: 'onUploadChange',
                    initialValue: data.pic,
                    rules: [{
                      type: 'string',
                      pattern: reg.httpRegWithProtocol,
                      required: true,
                      message: '请上传图片',
                    }],
                  })(<ImageUploadCustomed
                    crop={false}
                    disabled={disabled}
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

            <FormItem
              {...formItemLayout}
              label="广告名称"
            >
              {
                form.getFieldDecorator('title', {
                  initialValue: data.title,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '请输入广告名称',
                  }],
                })(<Input
                  style={{ width: '320px' }}
                  disabled={disabled}
                  placeholder="好的名称可以帮助搜索和查询"
                />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="广告文案"
            >
              {
                form.getFieldDecorator('desc', {
                  initialValue: data.desc,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '请输入广告文案',
                  }],
                })(<Input
                  style={{ width: '320px' }}
                  disabled={disabled}
                  placeholder="好的广告文案能吸引更多人"
                />)
              }
            </FormItem>

            <FormItem
              {...formItemLayoutNotRequired}
              label="广告web链接"
            >
              {
                form.getFieldDecorator('webLinkOption', {
                  initialValue: data.webLinkOption,
                  rules: [{
                    type: 'number',
                    required: true,
                  }],
                })(<RadioGroup
                  style={{ width: '280px' }}
                  disabled={disabled}
                >
                  <Radio style={radioStyle} key="0" value={0}>
                    <div styleName={`${prefix}-item-radio-label`}>打开网页</div>
                    <FormItem
                      style={{ display: 'inline-block' }}
                    >
                      {
                        form.getFieldValue('webLinkOption') === 0
                        && form.getFieldDecorator('url', {
                          initialValue: data.url,
                          rules: [{
                            type: 'string',
                            pattern: reg.httpRegWithProtocol,
                            message: '请输入正确的广告链接',
                          }],
                        })(<Input
                          disabled={disabled}
                          style={{ width: '320px' }}
                        />)
                      }
                    </FormItem>

                  </Radio>
                  <Radio style={radioStyle} key="1" value={1}>
                    <div styleName={`${prefix}-item-radio-label`}>打开侧边栏</div>
                    {
                      form.getFieldValue('webLinkOption') === 1
                      && form.getFieldDecorator('webSideBar', {
                        initialValue: data.webSideBar,
                        rules: [{
                          required: true,
                          message: '不能为空',
                        }],
                      })(<Select
                        disabled={disabled}
                        style={{ minWidth: '100px' }}
                      >
                        {
                          sidebarAdsList && sidebarAdsList.map(item => <Option
                            value={item._id}
                            key={item._id}
                          >
                            {item.title}
                          </Option>)
                        }
                      </Select>)
                    }

                  </Radio>
                </RadioGroup>)
              }
            </FormItem>

            <FormItem
              {...formItemLayoutNotRequired}
              label="广告移动端链接"
            >
              {
                form.getFieldDecorator('mobileLinkOption', {
                  initialValue: data.mobileLinkOption,
                })(<RadioGroup
                  style={{ width: '280px' }}
                  disabled={disabled}
                >
                  <Radio style={radioStyle} key="0" value={0}>
                    <div styleName={`${prefix}-item-radio-label`}>打开网页</div>
                    <FormItem
                      style={{ display: 'inline-block' }}
                    >
                      {
                        form.getFieldValue('mobileLinkOption') === 0
                        && form.getFieldDecorator('mobileUrl', {
                          initialValue: data.mobileUrl,
                          rules: [{
                            type: 'string',
                            pattern: reg.httpRegWithProtocol,
                            message: '请输入正确的广告链接',
                          }],
                        })(<Input
                          disabled={disabled}
                          style={{ width: '320px' }}
                        />)
                      }
                    </FormItem>
                  </Radio>
                  <Radio style={radioStyle} key="1" value={1}>
                    <div styleName={`${prefix}-item-radio-label`}>打开侧边栏</div>
                    {
                      form.getFieldValue('mobileLinkOption') === 1
                      && form.getFieldDecorator('mobileSideBar', {
                        initialValue: data.mobileSideBar,
                        rules: [{
                          required: true,
                          message: '不能为空',
                        }],
                      })(<Select
                        style={{ minWidth: '100px' }}
                        disabled={disabled}
                      >
                        {
                          sidebarAdsList && sidebarAdsList.map(item => <Option
                            value={item._id}
                            key={item._id}
                          >
                            {item.title}
                          </Option>)
                        }
                      </Select>)
                    }

                  </Radio>
                </RadioGroup>)
              }
            </FormItem>
            <FormItem
              {...formItemLayoutNotRequired}
              label="监测代码"
            >
              <MonitorUrl
                disabled={disabled}
                ctx={'monitorUrl'}
                monitorUrlList={data.monitorUrl}
              />
            </FormItem>

          </Form>
        </div>
      </ResourceModal>
    );
  }
}
