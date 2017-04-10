// official
import React, { Component, PropTypes } from 'react';
import update from 'react-addons-update';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Button, Row, Col, InputNumber, Input, Checkbox } from 'antd';
import _ from 'lodash';

// mine
import ResourceModal from '../../ResourceModal';
import config from './config';
import event from '../../../utils/event';
import MonitorUrl from '../../MonitorUrl';
import ImageUploadCustomed from '../../ImageUploadCustomed';
import utils from '../../../utils';
import style from './style.M.less';

const { reg, decorators: { formCreate } } = utils;
const FormItem = Form.Item;

@formCreate()
@CSSModule(style)
export default class MagicStickerAdsResource extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: {},
  }

  constructor(props) {
    super();

    const { data } = props;

    const dataConfig = {
      __t: 'MagicStickerAds',
      style: 0,
      title: '',
      leftEar: '',
      rightEar: '',
    };

    this.state = {
      loading: false,
      data: _.defaults(data, dataConfig),
    };
  }


  /**
   * 点击确定的提交表单
   * @private
   */
  onOk = () => {
    const { form, onOk } = this.props;
    const { data } = this.state;

    form.validateFields((err, values) => {
      if (err) {
        return false;
      }
      onOk({
        ...values,
        style: data.style,
        __t: data.__t,
      });
    });
  }

  render() {
    const prefix = 'ads-resource';

    const { isCreated, onCancel, form } = this.props;
    const { loading, data } = this.state;
    const { onOk } = this;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    };

    const modalProps = {
      isCreated,
      title: _.find(config, item => item.style === data.style).type,
      skinTypeList: config,
      skin: _.findIndex(config, item => item.style === data.style),
      onCancel,
      onOk,
      loading,
    };

    return (
      <ResourceModal
        {...modalProps}
      >
        <div styleName={prefix}>
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
                    message: '广告标题不能为空',
                  }],
                })(<Input
                  placeholder="请输入广告标题"
                  style={{ width: '250px' }}
                />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="左耳朵"
            >
              <div
                style={{ width: '200px', height: '200px' }}
              >
                {
                  form.getFieldDecorator('leftEar', {
                    valuePropName: 'fileURL',
                    trigger: 'onUploadChange',
                    initialValue: data.leftEar,
                    rules: [{
                      type: 'string',
                      pattern: reg.httpRegWithProtocol,
                      required: true,
                      message: '请上传图片',
                    }],
                  })(<ImageUploadCustomed
                    {...this.props}
                    crop={false}
                    disabled={false}
                    cropOptions={{
                      aspect: 1,
                    }}
                  />)
                }
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="右耳朵"
            >
              <div
                style={{ width: '200px', height: '200px' }}
              >
                {
                  form.getFieldDecorator('rightEar', {
                    valuePropName: 'fileURL',
                    trigger: 'onUploadChange',
                    initialValue: data.rightEar,
                    rules: [{
                      type: 'string',
                      pattern: reg.httpRegWithProtocol,
                      required: true,
                      message: '请上传图片',
                    }],
                  })(<ImageUploadCustomed
                    {...this.props}
                    crop={false}
                    disabled={false}
                    cropOptions={{
                      aspect: 1,
                    }}
                  />)
                }
              </div>
            </FormItem>
          </Form>
        </div>
      </ResourceModal>
    );
  }
}
