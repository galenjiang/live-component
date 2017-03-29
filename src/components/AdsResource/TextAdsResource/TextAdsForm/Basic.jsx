// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Row, Col, Input, Icon, Button, message, Radio, Select } from 'antd';
import _ from 'lodash';

// self
import ColorSelect from '../../../ColorSelect';
import event from '../../../../utils/event';
import MonitorUrl from '../../../MonitorUrl';
import utils from '../../../../utils';
import style from '../style.M.less';

const { reg, decorators: { formCreate } } = utils;


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

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
   * 添加一个新的选项
   */
  addTextItem = () => {
    const { form, disabled } = this.props;
    if (disabled) {
      message.error('不可修改！');
      return false;
    }
    const textListIndex = form.getFieldValue('textListIndex');

    // 限制只能添加5条
    if (textListIndex.length >= 5) {
      message.error('图文链选项最多支持5条');
      return false;
    }
    textListIndex.push({
      key: _.uniqueId(),
      style: 0,
      content: '',
      linkOption: 0,  // 0 打开网页  1 打开侧边栏
      url: '',
      sideBar: '',
      icon: '',
      monitorUrl: [],
    });

    form.setFieldsValue({
      textListIndex,
    });

    return false;
  }

    /**
   * 删除一个选项
   * @param index
   * @private
   */
  removeTextItem = (index) => {
    const { form, disabled } = this.props;
    if (disabled) {
      message.error('不可修改！');
      return false;
    }
    const textListIndex = form.getFieldValue('textListIndex');
    const textList = form.getFieldValue('textList');
    if (textListIndex.length <= 1) {
      message.error('图文链必须有一个选项');
      return false;
    }

    textListIndex.splice(index, 1);
    textList.splice(index, 1);

    form.setFieldsValue({
      textListIndex,
      textList,
    });
    return false;
  }

  render() {
    const { form, sidebarAdsList, disabled } = this.props;
    const { data } = this.state;
    const { addTextItem, removeTextItem } = this;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      required: true,
    };

    const colorSelectList = ['#4a90ae', '#f5a623', '#46b3b7', '#ff3b6b'];

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const prefix = 'text-ads-resource';

    form.getFieldDecorator('textListIndex', {
      initialValue: data.textList,
    });

    return (
      <section styleName={prefix}>
        <Row>
          {
            form.getFieldValue('textListIndex').map((item, index) => <Col
              span={12}
              key={index}
            >
              <div styleName={`${prefix}-item`}>
                <p styleName={`${prefix}-item-title`}>
                  内容{index + 1}
                </p>
                <div styleName={`${prefix}-item-content`}>
                  <div styleName={`${prefix}-item-delete`}>
                    {
                      !disabled
                      && <Icon type="delete" onClick={() => removeTextItem(index)} />
                    }
                  </div>
                  {/* 表单区域 */}
                  <Form>
                    <FormItem
                      {...formItemLayout}
                      label="样式底色"
                    >
                      {
                        form.getFieldDecorator(`textList[${index}].style`, {
                          valuePropName: 'current',
                          initialValue: data.textList[index].style,
                          rules: [{
                            type: 'number',
                            required: true,
                            message: '请输入底色样式',
                          }],
                        })(<ColorSelect
                          colors={colorSelectList}
                          disabled={disabled}
                        />)
                      }
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="描述内容"
                    >
                      {
                        form.getFieldDecorator(`textList[${index}].content`, {
                          initialValue: data.textList[index].content,
                          rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入描述内容',
                          }, {
                            max: 15,
                            message: '描述内容不能超过15个字符',
                          }],
                        })(<Input
                          disabled={disabled}
                        />)
                      }
                    </FormItem>

                    <FormItem
                      {...{
                        labelCol: { span: 6 },
                        wrapperCol: { span: 18 },
                        required: true,
                      }}
                      label="点击链接"
                    >
                      {
                        form.getFieldDecorator(`textList[${index}].linkOption`, {
                          initialValue: data.textList[index].linkOption,
                        })(<RadioGroup
                          style={{ width: '280px' }}
                          disabled={disabled}
                        >
                          <Radio style={radioStyle} key="0" value={0}>
                            <div styleName={`${prefix}-item-radio-label`}>打开网页</div>
                            {
                              form.getFieldValue(`textList[${index}].linkOption`) === 0
                              && <FormItem
                                style={{ width: '180px', display: 'inline-block' }}
                              >
                                {
                                  form.getFieldDecorator(`textList[${index}].url`, {
                                    initialValue: data.textList[index].url,
                                    rules: [{
                                      type: 'string',
                                      pattern: reg.httpRegWithProtocol,
                                      required: true,
                                      message: '请输入网页地址',
                                    }],
                                  })(<Input
                                    disabled={disabled}
                                  />)
                                }
                              </FormItem>
                            }
                          </Radio>
                          <Radio style={radioStyle} key="1" value={1}>
                            <div styleName={`${prefix}-item-radio-label`}>打开侧边栏</div>
                            {
                              form.getFieldValue(`textList[${index}].linkOption`) === 1
                              && <FormItem
                                style={{ width: '180px', display: 'inline-block' }}
                              >
                                  {
                                    form.getFieldDecorator(`textList[${index}].sideBar`, {
                                      initialValue: data.textList[index].sideBar,
                                      rules: [{
                                        type: 'string',
                                        required: true,
                                        message: '请输入侧边栏',
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
                                </FormItem>
                            }

                          </Radio>
                        </RadioGroup>)
                      }
                    </FormItem>
                    <FormItem
                      {...{
                        labelCol: { span: 6 },
                        wrapperCol: { span: 18 },
                        required: true,
                      }}
                      label="监测代码"
                    >
                      <MonitorUrl
                        disabled={disabled}
                        ctx={`textList[${index}].monitorUrl`}
                        monitorUrlList={data.textList[index].monitorUrl}
                      />
                    </FormItem>
                  </Form>


                </div>
              </div>
            </Col>)
          }
        </Row>
        <Row>
          <Col span={12}>
            <div styleName={`${prefix}-add-button`}>
              {
                !disabled
                && <Button
                  style={{ width: '100%' }}
                  onClick={addTextItem}
                >
                  添加内容
                </Button>
              }
            </div>
          </Col>
        </Row>
      </section>
    );
  }
}
