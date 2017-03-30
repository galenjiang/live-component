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
let monitorUrl = [];

@formCreate()
@CSSModule(style)
export default class NewsAdsResource extends Component {
  constructor(props) {
    super();

    const { data } = props;

    // 初始化
    const modelConfig = {
      __t: 'NewsAds',
      style: 0,
      title: '',
      newsPic: '',
      briefContent: '',
      origin: '',
      newsDate: '',
      iosRelate: {
        appStore: '',
        downloadLink: '',
        tuneUpLink: '',
      },
      androidRelate: {
        package: '', // 报名
        downloadLink: '', // 下载链接
        tuneUpLink: '', // 调起链接
      },
    };



    this.state = {
      loading: false,
      data: _.defaults(data, modelConfig),
    };
  }

  onOk = () => {
    const { form, onOk } = this.props;
    // before get monitorUrl value, clear array
    monitorUrl = [];
    let monitorErr = null;
    // event.$emit('validateMonitorUrl', (data) => {
    //   if (data instanceof Error) {
    //     monitorErr = data;
    //   }
    //   monitorUrl.push(data);
    // });

    form.validateFields((err, values) => {
      if (err) {
        return false;
      }

      if (monitorErr) return false;

      onOk({
        ...this.state.data,
        ...values,
      });
    });
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
    const { disabled, onCancel, isCreated, form, axiosComtomed, staticVideoJJAPI, qiniuUploadAPI } = this.props;
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

    const prefix = 'news-ads-resource';


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
              label="新闻图片"
            >
              <div
                style={{ width: '200px', height: '150px' }}
              >
                {
                  form.getFieldDecorator('newsPic', {
                    valuePropName: 'fileURL',
                    trigger: 'onUploadChange',
                    initialValue: data.newsPic,
                    rules: [{
                      type: 'string',
                      pattern: reg.httpRegWithProtocol,
                      required: true,
                      message: '请上传图片',
                    }],
                  })(<ImageUploadCustomed
                    disabled={disabled}
                    crop={false}
                    cropOptions={{
                      aspect: 1,
                    }}
                    axiosComtomed={axiosComtomed}
                    staticVideoJJAPI={staticVideoJJAPI}
                    qiniuUploadAPI={qiniuUploadAPI}
                  />)
                }
              </div>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="标题名称"
            >
              {
                form.getFieldDecorator('title', {
                  initialValue: data.title,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }, {
                    max: 20,
                    message: '不能大于20个字符',
                  }],
                })(<Input
                  disabled={disabled}
                  style={{ width: '320px' }}
                  placeholder="请输入标题名称"
                />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="缩略内容"
            >
              {
                form.getFieldDecorator('briefContent', {
                  initialValue: data.briefContent,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }],
                })(<Input
                  disabled={disabled}
                  type="textarea"
                  autosize={{ minRows: 3, maxRows: 6 }}
                  style={{ width: '320px' }}
                  placeholder="请输入缩略内容"
                />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="来源"
            >
              {
                form.getFieldDecorator('origin', {
                  initialValue: data.origin,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }],
                })(<Input
                  disabled={disabled}
                  style={{ width: '320px' }}
                  placeholder="请输入新闻来源"
                />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新闻时间"
            >
              {
                form.getFieldDecorator('newsDate', {
                  initialValue: data.newsDate,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }],
                })(<Input
                  disabled={disabled}
                  style={{ width: '320px' }}
                  placeholder="请输入新闻时间"
                />)
              }
            </FormItem>

            {/* iso */}
            <h3>IOS相关</h3>
            <hr styleName={`${prefix}-seperator`} />
            <FormItem
              {...formItemLayout}
              label="appstore跳转外链"
            >
              {
                form.getFieldDecorator('iosRelate.appStore', {
                  initialValue: data.iosRelate.appStore,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }, {
                    pattern: reg.httpRegWithProtocol,
                    message: 'url格式不正确',
                  }],
                })(<Input
                  disabled={disabled}
                  placeholder="请输入appstore跳转外链"
                />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="下载链接"
            >
              {
                form.getFieldDecorator('iosRelate.downloadLink', {
                  initialValue: data.iosRelate.downloadLink,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }, {
                    pattern: reg.httpRegWithProtocol,
                    message: 'url格式不正确',
                  }],
                })(<Input
                  disabled={disabled}
                  placeholder="请输入下载链接"
                />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="调起链接"
            >
              {
                form.getFieldDecorator('iosRelate.tuneUpLink', {
                  initialValue: data.iosRelate.tuneUpLink,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }],
                })(<Input
                  disabled={disabled}
                  placeholder="请输入调起链接"
                />)
              }
            </FormItem>
            {/* andriod */}
            <h3>Android相关</h3>
            <hr styleName={`${prefix}-seperator`} />
            <FormItem
              {...formItemLayout}
              label="包名"
            >
              {
                form.getFieldDecorator('androidRelate.package', {
                  initialValue: data.androidRelate.package,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }],
                })(<Input
                  disabled={disabled}
                  style={{ width: '320px' }}
                  placeholder="请输入appstore跳转外链"
                />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="下载链接"
            >
              {
                form.getFieldDecorator('androidRelate.downloadLink', {
                  initialValue: data.androidRelate.downloadLink,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }, {
                    pattern: reg.httpRegWithProtocol,
                    message: 'url格式不正确',
                  }],
                })(<Input
                  disabled={disabled}
                  placeholder="请输入下载链接"
                />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="调起链接"
            >
              {
                form.getFieldDecorator('androidRelate.tuneUpLink', {
                  initialValue: data.androidRelate.tuneUpLink,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '不能为空',
                  }],
                })(<Input
                  disabled={disabled}
                  placeholder="请输入调起链接"
                />)
              }
            </FormItem>
          </Form>
        </div>
      </ResourceModal>
    );
  }
}
