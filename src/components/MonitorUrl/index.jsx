// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';


// 3rd-part
import { Form, Button, Icon, Input, Checkbox, Select } from 'antd';
import _ from 'lodash';

// mine
import utils from '../../utils';
import style from './style.M.less';
import constant from '../../constants';
import event from '../../utils/event';

const FormItem = Form.Item;
const Option = Select.Option;
const { monitor: { agentList, detectionList } } = constant;
const { reg, decorators: { formCreate } } = utils;

@formCreate()
@CSSModule(style)
export default class MonitorUrl extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    monitorUrlList: PropTypes.array,
  }

  static defaultProps = {
    disabled: false,
    monitorUrlList: [],
  }

  constructor(props) {
    super();
    const { monitorUrlList } = props;

    this.state = {
      monitorUrl: monitorUrlList.map((item) => {
        item.key = _.uniqueId();
        return item;
      }),
      show: true,
    };
  }


  componentDidMount() {
    const { form, ctx } = this.props;
    this.eventEmitter = (callback) => {
      form.validateFields((err, values) => {
        if (err) {
          callback(new Error());
        } else {
          callback({ [ctx]: values.monitorUrlList });
        }
      });
    };
    event.$on('validateMonitorUrl', this.eventEmitter);
  }


  componentWillUnmount() {
    event.$off('validateMonitorUrl', this.eventEmitter);
  }


  addMonitorUrlItem = () => {
    const { form } = this.props;
    const monitorUrlListIndex = form.getFieldValue('monitorUrlListIndex');
    monitorUrlListIndex.push(['web', 'click', '', true]);
    form.setFieldsValue({
      monitorUrlListIndex,
    });
    this.setState({
      show: true,
    })
  }

  removeMonitorUrlItem = (index) => {
    const { form } = this.props;
    const monitorUrlListIndex = form.getFieldValue('monitorUrlListIndex');
    const monitorUrlList = form.getFieldValue('monitorUrlList');
    monitorUrlListIndex.splice(index, 1);
    monitorUrlList.splice(index, 1);

    form.setFieldsValue({
      monitorUrlListIndex,
      monitorUrlList,
    });
  }

  toggleMonitor = () => {
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    const { monitorUrlList, form, disabled } = this.props;
    const { removeMonitorUrlItem, addMonitorUrlItem, toggleMonitor } = this;

    const prefix = 'monitor-url';

    // textList = [{
    //   style: 0,
    //   content: '111',
    //   linkOption: 0,  // 0 打开网页  1 打开侧边栏
    //   url: 'www.baidu.com',
    //   sideBar: { _id: '1' },
    //   icon: 'www.baidu.com',
    //   monitorUrl: [{
    //     admaster: false,
    //     ios: { click: 'http://www.baidu.com' },
    //   }, {
    //     admaster: false,
    //     ios: { view: 'http://www.baidu.com' },
    //   }],
    // }],


    form.getFieldDecorator('monitorUrlListIndex', {
      initialValue: monitorUrlList,
    });


    return (
      <div styleName={prefix}>
        {
          !disabled
          && <Button
            type="primary"
            onClick={addMonitorUrlItem}
          >
            添加监测代码
          </Button>
        }
        <Button
          style={{ marginLeft: '10px' }}
          type="primary"
          onClick={toggleMonitor}
        >
          {
            this.state.show ? '隐藏' : '显示'
          }
        </Button>
        {/*
          form.getFieldDecorator(`monitorUrlList`, {
            initialValue: [],
            rules: [],
          })(<Input />)
          */}
        {
          (form.getFieldValue('monitorUrlListIndex').length > 0)
          && <div
            styleName={`${prefix}-list-container`}
            style={{ display: this.state.show ? 'block' : 'none' }}
          >
            {
              form.getFieldValue('monitorUrlListIndex').map((item, index) => <div
                styleName={`${prefix}-item`}
                key={index}
              >
                {
                  !disabled
                  && <a
                    onClick={() => removeMonitorUrlItem(index)}
                  >
                    <Icon
                      type="minus-circle-o"
                      styleName={`${prefix}-item-unit`}
                    />
                  </a>
                }

                {
                  form.getFieldDecorator(`monitorUrlList[${index}][0]`, {
                    initialValue: monitorUrlList[index][0],
                    rules: [{
                      type: 'string',
                      required: true,
                      message: '请输入监测平台',
                    }],
                  })(<Select
                    styleName={`${prefix}-item-unit`}
                    style={{ width: '80px' }}
                    disabled={disabled}
                  >
                    {
                      agentList.map(item => <Option
                        key={item.value}
                        value={item.value}
                      >
                        {item.name}
                      </Option>)
                    }
                  </Select>)
                }
                {
                  form.getFieldDecorator(`monitorUrlList[${index}][1]`, {
                    initialValue: monitorUrlList[index][1],
                    rules: [{
                      type: 'string',
                      required: true,
                      message: '请输入监测方式',
                    }],
                  })(<Select
                    styleName={`${prefix}-item-unit`}
                    style={{ width: '80px' }}
                    disabled={disabled}
                  >
                    {
                      detectionList.map(item => <Option
                        key={item.value}
                        value={item.value}
                      >
                        {item.name}
                      </Option>)
                    }
                  </Select>)
                }
                <FormItem
                  styleName={`${prefix}-item-unit`}
                  style={{ display: 'inline-block', width: '150px' }}
                >
                  {
                    form.getFieldDecorator(`monitorUrlList[${index}][2]`, {
                      initialValue: monitorUrlList[index][2],
                      rules: [{
                        type: 'string',
                        required: true,
                        message: '监测地址不能为空',
                      }, {
                        pattern: reg.httpRegWithProtocol,
                        message: '请输入监测地址',
                      }],
                    })(<Input
                      disabled={disabled}
                      placeholder="请输入监测地址"
                    />)
                  }
                </FormItem>
                {
                  form.getFieldDecorator(`monitorUrlList[${index}][3]`, {
                    initialValue: monitorUrlList[index][3],
                    valuePropName: 'checked',
                  })(<Checkbox
                    styleName={`${prefix}-item-unit`}
                    disabled={disabled}
                  >
                    移动设备回传
                  </Checkbox>)
                }
              </div>)
            }
          </div>
        }
      </div>
    );
  }

}
