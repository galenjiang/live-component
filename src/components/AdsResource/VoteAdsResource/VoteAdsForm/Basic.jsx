// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Row, Col, Input, Icon, Button, message, Radio, Select, Checkbox, InputNumber } from 'antd';
import _ from 'lodash';

// self
import MonitorUrl from '../../../MonitorUrl';
// import ImageUploadCustomed from '../../../ImageUploadCustomed';
import utils from '../../../../utils';
import style from '../style.M.less';

const { event, reg, decorators: { formCreate } } = utils;


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let monitorUrl = [];

@formCreate()
@CSSModule(style)
export default class Basic extends Component {
  constructor(props) {
    super();
    this.state = {
      data: _.cloneDeep(props.data),
    };
  }

  componentDidMount() {
    const { form } = this.props;
    event.$on('validateFields', (callback) => {
      // before get monitorUrl value, clear array
      monitorUrl = [];
      let monitorErr = null;
      event.$emit('validateMonitorUrl', (data) => {
        if (data instanceof Error) {
          monitorErr = data;
        }
        monitorUrl.push(data);
      });

      form.validateFields((err, values) => {
        if (err) {
          return false;
        }

        if (monitorErr) return false;

        callback(values, monitorUrl);
      });
    });

    this.forceUpdate();
  }


  componentWillUnmount() {
    event.$clear('validateFields');
  }

    /**
   * 添加新的 qoptions
   */
  addQoption = () => {
    const { form } = this.props;
    const qoptionsIndex = form.getFieldValue('qoptionsIndex');
    qoptionsIndex.push({
      key: _.uniqueId(),
      title: '',
      pic: '',
    });
    form.setFieldsValue({
      qoptionsIndex,
    });
  }

  /**
   * 移除 一个  qoptions
   * @param index
   */
  removeQoption = (index) => {
    const { form } = this.props;
    const qoptionsIndex = form.getFieldValue('qoptionsIndex');
    const qoptions = form.getFieldValue('qoptions');
    qoptionsIndex.splice(index, 1);
    qoptions.splice(index, 1);
    form.setFieldsValue({
      qoptionsIndex,
      qoptions,
    });
  }

  render() {
    const { form, disabled } = this.props;
    const { data } = this.state;
    const { removeQoption, addQoption } = this;

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

    const qoptionsFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      required: true,
    };

    const prefix = 'vote-ads-resource';

    form.getFieldDecorator('qoptionsIndex', {
      initialValue: data.qoptions,
    });
    form.getFieldDecorator('qoptions', {
      initialValue: _.range(data.qoptions.length),
    });

    return (
      <div
        styleName={prefix}
      >
        {/* 基础选项 */}
        <Row>
          <Col span={18} offset={6}>
            <section styleName={`${prefix}-configure-title`}>
              {
                form.getFieldDecorator('voteRepeat', {
                  valuePropName: 'checked',
                  initialValue: data.voteRepeat,
                })(<Checkbox
                  disabled={disabled}
                >
                  允许重复投票
                </Checkbox>)
              }

              <span>
                选项显示方式:
              </span>
              {
                form.getFieldDecorator('qoptionsType', {
                  initialValue: data.qoptionsType,
                })(<RadioGroup
                  disabled={disabled}
                >
                  <Radio key={0} value={0}>百分比</Radio>
                  {/* 科技风不能选数字 */}
                  <Radio key={1} value={1}>数字</Radio>
                </RadioGroup>)
              }
            </section>
          </Col>
        </Row>


        {/* 投票字段 */}
        <FormItem
          {...formItemLayout}
          label="投票标题"
        >
          {
            form.getFieldDecorator('title', {
              initialValue: data.title,
              rules: [{
                type: 'string',
                required: true,
                message: '请输入投票标题',
              }],
            })(<Input
              disabled={disabled}
              style={{ width: '250px' }}
            />)
          }
        </FormItem>
        <FormItem
          {...notRequiredFormItemLayout}
          label="外链地址"
        >
          {
            form.getFieldDecorator('url', {
              initialValue: data.url,
              rules: [{
                type: 'string',
                pattern: reg.httpRegWithProtocol,
                message: '请输入正确的外链地址',
              }],
            })(<Input
              disabled={disabled}
            />)
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="投票倍数"
        >
          {
            form.getFieldDecorator('multiple', {
              initialValue: data.multiple,
              rules: [{
                type: 'number',
                required: true,
                message: '请输入正确的投票倍数',
              }],
            })(<InputNumber
              disabled={disabled}
              style={{ style: '250px' }}
              min={0}
            />)
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="指定结果"
        >
          {
            form.getFieldDecorator('specifyIdx', {
              initialValue: String(data.specifyIdx),
            })(<Select
              disabled={disabled}
              style={{ width: '250px' }}
            >
              <Option value={'-1'} key={-1}>无</Option>
              {
                (form.getFieldValue('qoptions') || []).map((item, index) => <Option
                  value={String(index)}
                  key={index}
                >
                  {`选项${index + 1}： ${item.title || ''}`}
                </Option>)
              }
            </Select>)
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="投票向上位移值"
        >
          {
            form.getFieldDecorator('upPlace', {
              initialValue: data.upPlace,
              rules: [{
                type: 'number',
                required: true,
                message: '请输入正确的位移值',
              }],
            })(<InputNumber
              disabled={disabled}
              style={{ style: '250px' }}
              placeholder="投票向上位移量，单位px"
            />)
          } px
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="热点监测代码"
        >
          <MonitorUrl
            ctx={'monitorUrl'}
            disabled={disabled}
            monitorUrlList={data.monitorUrl}
          />
        </FormItem>
        {/* 投票额外选项 */}
        <section styleName={`${prefix}-configure-qoptions`}>
          <Row>
            {
              form.getFieldValue('qoptionsIndex').map((item, index) => <Col
                key={index}
                span={12}
              >
                <div styleName={`${prefix}-configure-qoptions-list`}>
                  <p styleName={`${prefix}-configure-qoptions-title`}>选项{index + 1}</p>
                  <div styleName={`${prefix}-configure-qoptions-detail`}>
                    {
                      !disabled
                      && <div styleName={`${prefix}-configure-qoptions-delete`}>
                        <Icon
                          onClick={() => removeQoption(index)}
                          type="delete"
                        />
                      </div>
                    }
                    {/* <FormItem
                      {...qoptionsFormItemLayout}
                      wrapperCol={{ span: 12 }}
                      label="投票图片"
                    >
                      <div
                        styleName={`${prefix}-option-crop`}
                        style={{ width: '200px', height: '200px' }}
                      >
                        {
                          form.getFieldDecorator(`qoptions[${index}].pic`, {
                            valuePropName: 'fileURL',
                            trigger: 'onUploadChange',
                            initialValue: data.qoptions[index].pic,
                          })(<ImageUploadCustomed
                            {...{
                              crop: true,
                              disabled: true,
                              cropOptions: {},
                            }}
                          />)
                        }
                      </div>
                    </FormItem> */}
                    <FormItem
                      {...qoptionsFormItemLayout}
                      label="选项标题"
                    >
                      {
                        form.getFieldDecorator(`qoptions[${index}].title`, {
                          initialValue: data.qoptions[index].title,
                          rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入选项标题',
                          }, {
                            max: 15,
                            message: '选项标题不能大于15个字符',
                          }],
                        })(<Input
                          disabled={disabled}
                        />)
                      }
                    </FormItem>
                  </div>
                </div>
              </Col>)
            }
          </Row>
          <Row>
            <Col span={12} style={{ padding: '1em' }}>
              <Button
                type="ghost"
                style={{ width: '100%' }}
                onClick={addQoption}
              >
                添加内容
              </Button>
            </Col>
          </Row>
        </section>
      </div>
    );
  }
}




