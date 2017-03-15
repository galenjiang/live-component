// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import _ from 'lodash';

// self
import Basic from './TextAdsForm/Basic';
import Classic from './TextAdsForm/Classic';
import ResourceModal from '../../ResourceModal';
import config from './config';
import event from '../../../utils/event';
import style from './style.M.less';

@CSSModule(style)
export default class TextAdsResource extends Component {

  static propsType = {
    data: PropTypes.object.isRequired,
    isCreated: PropTypes.bool.isRequired,
    sidebarAdsList: PropTypes.array.isRequired,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    data: {},
    sidebarAdsList: [],
  }

  constructor(props) {
    super();
    const { data } = props;

    const modelConfig = {
      __t: 'TextAds',
      title: '',
      style: 0,  // 皮肤类型
      textList: [{
        key: _.uniqueId(),
        style: 0,
        content: '',
        linkOption: 0,  // 0 打开网页  1 打开侧边栏
        url: '',
        sideBar: props.sidebarAdsList[0]._id,
        icon: '',
        monitorUrl: [],
      }],
    };

    const sortedData = _(data)
      .mapValues((item, key) => {
        if (key === 'textList') {
          return _(item)
            .map((textItem) => {
              textItem.key = _.uniqueId();
              return textItem;
            })
            .value();
        }
        return item;
      })
      .value();

    this.state = {
      loading: false,
      data: _.defaults(sortedData, modelConfig),
    };
  }

  /**
   * 提交的时候
   * @private
   */
  onOk = () => {
    event.$emit('validateFields', (...args) => {
      console.log(args);
    });


    // const data = _.cloneDeep(this.state.data)

    // let result = validate(data, _.find(textConfig, item => item.style === data.style).validate)

    // if (!result.res) {
    //   let stackList = result.stack
    //   message.error(`${_(stackList).map(item => item.key).compact().value().join(',')}${stackList[stackList.length - 1].error}`)
    //   return false
    // }

    // const textList = data.textList

    // for (let i = 0; i < textList.length; i++) {
    //   let item = textList[i]

    //   if (item.linkOption === 0) {
    //     if (!commonHttpRegNotRequired.test(item.url)) {
    //       message.error(`第${i + 1}个的图文链链接配置不正确`)
    //       return false
    //     }
    //   } else if (item.linkOption === 1) {
    //     if (!item.sideBar) {
    //       message.error(`第${i + 1}个的图文链链接配置不正确`)
    //       return false
    //     }
    //   }

    //   if (!monitorUrlValidate(item.monitorUrl, `第${i + 1}图文链`)) {
    //     return false
    //   }
    //   delete item.key

    // }

    // // 开始上传数据
    // let { onOk } = this.props;

    // this.setState({
    //   loading: true,
    // }, async () => {
    //   try {
    //     await onOk({
    //       ...data,
    //       title: data.textList[0].content,
    //     });
    //   } catch (e) {
    //     this.setState({
    //       loading: false,
    //     });
    //   }
    // });
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
    const { onCancel, isCreated } = this.props;
    const { loading, data } = this.state;
    const { onSkinChange, onOk } = this;

    const modalProps = {
      isCreated,
      title: _.find(config, item => item.style === data.style).type,
      skinTypeList: config,
      skin: _.findIndex(config, item => item.style === data.style),
      onSkinChange,
      onOk,
      onCancel,
      loading,
    };

    return (
      <ResourceModal
        {...modalProps}
      >
        {
          data.style === 0
          && <Basic
            {...this.props}
            data={data}
          />
        }
        {
          data.style === 1
          && <Classic
            {...this.props}
            data={data}
          />
        }
        {/*<section styleName={prefix}>
          <Row>*/}


            {/*{
              getFieldValue('textListIndex').map((item, index) => <Col
                span={12}
                key={index}
              >

                <div styleName={`${prefix}-item`}>

                  <p styleName={`${prefix}-item-title`}>
                    内容{index + 1}
                  </p>
                  <div styleName={`${prefix}-item-content`}>
                    <div styleName={`${prefix}-item-delete`}>
                      <Icon type="delete" onClick={() => deleteQoption(index)} />
                    </div>
                    <FormItem
                      {...formItemLayout}
                      label="样式底色"
                    >
                      {
                        getFieldDecorator(`textList[${index}].style`, {
                          valuePropName: 'current',
                          initialValue: 0,
                          rules: [{
                            type: 'number',
                            required: true,
                            message: '请输入底色样式',
                          }],
                        })(<ColorSelect
                          // 古典风特点为5个颜色
                          colors={data.style !== 1 ? colorSelectList : mangoColorSelectList}
                        />)
                      }
                    </FormItem>
                    {
                      data.style === 1
                      && <FormItem
                        {...formItemLayout}
                        label="ICON小图"
                      >
                        <div style={{ width: '100px', height: '100px' }}>
                          {
                            getFieldDecorator(`textList[${index}].icon`, {
                              valuePropName: 'fileURL',
                              trigger: 'onUploadChange',
                              initialValue: '',
                              rules: [{
                                type: 'string',
                                pattern: reg.httpRegWithProtocol,
                                required: true,
                                message: '描述栏内容',
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
                    }
                    <FormItem
                      {...formItemLayout}
                      label="描述内容"
                    >
                      {
                        getFieldDecorator(`textList[${index}].content`, {
                          initialValue: '',
                          rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入描述内容',
                          }],
                        })(<Input />)
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
                        getFieldDecorator(`textList[${index}].linkOption`, {
                          initialValue: 0,
                        })(<RadioGroup
                          style={{ width: '280px' }}
                        >
                          <Radio style={radioStyle} key="0" value={0}>
                            <div styleName={`${prefix}-item-radio-label`}>打开网页</div>
                            {
                              getFieldValue(`textList[${index}].linkOption`) === 0
                              && <FormItem
                                    style={{ width: '180px', display: 'inline-block' }}
                                  >
                                {
                                  getFieldDecorator(`textList[${index}].url`, {
                                    initialValue: '',
                                    rules: [{
                                      type: 'string',
                                      pattern: reg.httpRegWithProtocol,
                                      required: true,
                                      message: '请输入网页地址',
                                    }],
                                  })(<Input
                                  />)
                                }
                              </FormItem>

                            }
                          </Radio>
                          <Radio style={radioStyle} key="1" value={1}>
                            <div styleName={`${prefix}-item-radio-label`}>打开侧边栏</div>
                            {
                              getFieldValue(`textList[${index}].linkOption`) === 1
                              && <FormItem
                                  style={{ width: '180px', display: 'inline-block' }}
                                >
                                  {
                                    getFieldDecorator(`textList[${index}].sideBar`, {
                                      initialValue: '',
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


                  </div>
                </div>
              </Col>)
            }*/}

            {/*{
              data.textList.map((item, index) => {
                return (
                  <Col span={12} key={item.key}>
                    <div styleName={`${prefix}-item`}>

                      <p styleName={`${prefix}-item-title`}>
                        内容{index + 1}
                      </p>
                      <div styleName={`${prefix}-item-content`}>
                        <div styleName={`${prefix}-item-delete`}>
                          <Icon type="delete" onClick={() => deleteQoption(index)} />
                        </div>
                        <FormItem
                          {...formItemLayout}
                          label="样式底色"
                        >
                          getFieldDecorator('')
                          <ColorSelect
                            // 古典风特点为5个颜色
                            colors={data.style !== 1 ? colorSelectList : mangoColorSelectList}
                            current={item.style}
                            onChange={ key => __setFields(index, 'style', key)}
                          />
                        </FormItem>

                        {
                          data.style === 1
                          && <FormItem
                            {...formItemLayout}
                            label="ICON小图">
                            <div style={{ width: '100px', height: '100px' }}>
                              <ImageUploader
                                {...{
                                  crop: true,
                                  disabled: false,
                                  cropOptions: {
                                    aspect: 1,
                                  },
                                }}
                                fileURL={item.icon}
                                onUploadChange={url => __setFields(index, 'icon', url)}
                              />
                            </div>
                          </FormItem>
                        }
                        <FormItem
                          {...formItemLayout}
                          label="描述内容">
                          <Input
                            autoComplete="off"
                            maxLength="15"
                            value={item.content}
                            onChange={ (e) => __setFields(index, 'content', e.target.value)}
                          />
                        </FormItem>
                        <FormItem
                          {...{
                            labelCol: { span: 6 },
                            wrapperCol: { span: 18 },
                            required: true
                          }}
                          label="点击链接">
                          <RadioGroup
                            style={{ width: '280px' }}
                            onChange={ e => __setFields(index, 'linkOption', e.target.value)}
                            value={item.linkOption || 0}
                          >
                            <Radio style={radioStyle} key="0" value={0}>
                              <div styleName={`${prefix}-item-radio-label`}>打开网页</div>
                              {
                                item.linkOption === 0 &&
                                <Input
                                  value={item.url}
                                  style={{ width: '180px' }}
                                  onChange={e => __setFields(index, 'url', e.target.value) }
                                />
                              }

                            </Radio>
                            <Radio style={radioStyle} key="1" value={1}>
                              <div styleName={`${prefix}-item-radio-label`}>打开侧边栏</div>
                              {
                                item.linkOption === 1 &&
                                <Select
                                  style={{ minWidth: '100px' }}
                                  value={item.sideBar}
                                  onChange={value => __setFields(index, 'sideBar', value)}
                                >
                                  {
                                    sidebarAdsList && sidebarAdsList.map(item => {
                                      return (
                                        <Option
                                          value={item._id}
                                          key={item._id}
                                        >
                                          {item.title}
                                        </Option>
                                      )
                                    })

                                  }
                                </Select>
                              }

                            </Radio>
                          </RadioGroup>
                        </FormItem>
                        <MonitorUrl
                          isCreateBall={isCreateBall}
                          monitorUrlList={item.monitorUrl || []}
                          onChange={(data) => {
                            setMonitorUrl(index, data)
                          }}
                        />
                      </div>

                    </div>

                  </Col>
                )
              })
            }*/}
          {/*</Row>
          <Row>
            <Col span={12}>
              <div styleName={`${prefix}-add-button`}>
                <Button
                  style={{ width: '100%' }}
                  onClick={addNewQoption}
                >
                  添加内容
                </Button>
              </div>
            </Col>
          </Row>
        </section>*/}
      </ResourceModal>
    );
  }
}
