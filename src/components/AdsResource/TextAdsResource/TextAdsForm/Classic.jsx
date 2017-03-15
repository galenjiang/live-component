// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Row, Col, Input, Icon, Button, message, Radio, Select } from 'antd';
import _ from 'lodash';

// self
import utils from '../../../../utils';
import ImageUploadCustomed from '../../../ImageUploadCustomed';
import ColorSelect from '../../../ColorSelect';
import MonitorUrl from '../../../MonitorUrl';
import event from '../../../../utils/event';
import style from '../style.M.less';

const { reg, decorators: { formCreate } } = utils;


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
  }

  componentWillUnmount() {
    event.$clear('validateFields');
  }


  /**
   * 添加一个新的选项
   */
  addTextItem = () => {
    const { form } = this.props;
    const { data } = this.state;
    const textListIndex = form.getFieldValue('textListIndex');
    if (data.style === 1) {
      message.error('古典风图文链选项只能支持1条');
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
    const { form } = this.props;
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
    const { form, sidebarAdsList } = this.props;
    const { data } = this.state;
    // const { removeTextItem } = this;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      required: true,
    };

    const colorSelectList = ['rgba(0,0,0,0.6)', 'rgba(41, 171, 226, 0.6)', 'rgba(255, 196, 82, 0.6)', 'rgba(57, 181, 74, 0.6)'];

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const prefix = 'text-ads-resource';

    form.getFieldDecorator('textListIndex', {
      initialValue: [data.textList[0]],
    });


    return (
      <section styleName={prefix}>
        <Row>
          {
            form.getFieldValue('textListIndex').map((item, index) => <Col
              span={24}
              key={item.key}
            >
              <div styleName={`${prefix}-item`}>
                <p styleName={`${prefix}-item-title`}>
                  内容{index + 1}
                </p>
                <div styleName={`${prefix}-item-content`}>
                  {/* <div styleName={`${prefix}-item-delete`}>
                    <Icon type="delete" onClick={() => removeTextItem(index)} />
                  </div>*/}
                  {/* 表单区域 */}
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
                      />)
                    }
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="ICON小图"
                  >
                    <div style={{ width: '100px', height: '100px' }}>
                      {
                        form.getFieldDecorator(`textList[${index}].icon`, {
                          valuePropName: 'fileURL',
                          trigger: 'onUploadChange',
                          initialValue: data.textList[index].icon,
                          rules: [{
                            type: 'string',
                            pattern: reg.httpRegWithProtocol,
                            required: true,
                            message: '请上传ICON小图',
                          }],
                        })(<ImageUploadCustomed
                          crop
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
                      })(<Input />)
                    }
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="点击链接"
                  >
                    {
                      form.getFieldDecorator(`textList[${index}].linkOption`, {
                        initialValue: data.textList[index].linkOption,
                      })(<RadioGroup
                        style={{ width: '280px' }}
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
                                })(<Input />)
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
                    {...formItemLayout}
                    label="监测代码"
                  >
                    <MonitorUrl
                      monitorUrlList={data.textList[index].monitorUrl}
                    />
                  </FormItem>
                </div>
              </div>
            </Col>)
          }
        </Row>
        {/*<Row>
          <Col span={12}>
            <div styleName={`${prefix}-add-button`}>
              <Button
                style={{ width: '100%' }}
                onClick={addTextItem}
              >
                添加内容
              </Button>
            </div>
          </Col>
        </Row>*/}
      </section>
    )
  }
}
