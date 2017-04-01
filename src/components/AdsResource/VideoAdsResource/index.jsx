// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Button, Row, Col, InputNumber, Input, message, Checkbox } from 'antd';
import _ from 'lodash';

// mine
import ResourceModal from '../../ResourceModal';
import config from './config';
import event from '../../../utils/event';
import MonitorUrl from '../../MonitorUrl';
import utils from '../../../utils';
import style from './style.M.less';

const { reg, decorators: { formCreate } } = utils;
const FormItem = Form.Item;

@formCreate()
@CSSModule(style)
export default class VideoAdsResource extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
    styleConfig: {
      VideoAds: {
        style: config.map(item => item.style),
      },
    },
  }

  constructor(props) {
    super();

    const { data } = props;

    const dataConfig = {
      __t: 'VideoAds',
      style: 0,
      title: '',
      totalEx: 0,
      isPiP: false,
      allowClose: true,
      closeTime: 0,
      usePlayerVolume: true,
      volume: 50,
      videoList: [],
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

      const sortedData = _(values).omit('videoListIndex').value();
      _(monitorUrl).forEach((item, key) => {
        const monitor = _(item)
          .map(el => ({
            [el[0]]: {
              [el[1]]: el[2],
            },
            admaster: el[3],
          }))
          .value();
        _.set(sortedData, key, monitor);
      });

      onOk({
        ...this.state.data,
        ...sortedData,
      });
    });


    //   let formData = {}
    //   formData.__t = 'VideoAds'
    //   const { videoList } = this.state.data
    //   let len = videoList.length, i

    //   if (len <= 0) {
    //     message.error(`中插球配置选项错误:请至少添加一个视频`)
    //     return false
    //   }

    //   let totalEx = 0
    //   videoList.forEach(item => {
    //     totalEx += Number(item.ex)
    //   })
    //   if (totalEx > Number(values.totalEx)) {
    //     message.error(`中插广告配置选项错误:视频总时间填写不能小于视频时间总合`)
    //     return false
    //   }


    //   // 对视频关闭时间进行判断
    //   if (values.allowClose) {

    //     if (!isNumber(values.closeTime)) {
    //       message.error(`中插广告配置选项错误:视频关闭时间必须填写`)
    //       return false
    //     }

    //     if (values.closeTime > values.totalEx) {
    //       message.error(`中插广告配置选项错误:视频关闭时间不能大于视频总时间`)
    //       return false
    //     }
    //   }

    //   if (!values.usePlayerVolume && !isNumber(values.volume)) {
    //     message.error(`中插广告配置选项错误:视频播放音量必须要填写`)
    //     return false
    //   }

    //   //检查 video list 是否合法
    //   for (i = 0; i < len; i++) {
    //     let item = videoList[i]
    //     if (!httpRegWithOutProtocol.test(item.source)) {
    //       // source url illegal
    //       message.error(`中插球配置选项错误:当前第${i + 1}个中插选项中的中插链接不合法`)
    //       return false
    //     }
    //     if (!httpRegWithOutProtocol.test(item.link)) {
    //       // source link illegal
    //       message.error(`中插球配置选项错误:当前第${i + 1}个中插选项的中插外链不合法`)
    //       return false
    //     }

    //     if (!monitorUrlValidate(item.monitorUrl, `第${i + 1}个中插选项`)) {
    //       return false
    //     }

    //   }


    //   values.volume && (values.volume = values.volume / 100)
    //   //TODO 开始自动检测视频能否播放,暂时不需要这个功能
    //   this.__checkVideoListVailed(videoList.map(item => item.source))
    //     .then(() => {
    //       //开始上传数据
    //       let { onOk } = this.props

    //       this.setState({
    //         loading: true
    //       }, async() => {
    //         try {
    //           await onOk(Object.assign({}, values, formData, { videoList }))
    //         } catch ( e ) {
    //           this.setState({
    //             loading: false
    //           })
    //         }

    //       })
    //     })
    //     .catch(e => {
    //       message.error(`中插广告配置选项错误:当前第${e.key + 1}个中插选项当的中插视频链接:${e.value}无法解析`)
    //       return false
    //     })
    // })
  }


  /**
   * 检查 视频 地址 是否能够播放
   * @param videoResourceList
   * @returns {Promise}
   * @private
   */
  checkVideoListVailed(videoResourceList) {
    // let len = videoResourceList.length
    // let i = 0
    // return Promise.resolve()
    // return new Promise((resolve, reject) => {
    //   videoResourceList.forEach((item, index) => {

    //     if (!/\.flv$/.test(item)) {
    //       //跳过 flv 文件
    //       let video = document.createElement('video')
    //       video.src = item
    //       video.oncanplay = function () {
    //         video = null
    //         i++
    //         if (i === len) {
    //           resolve()
    //         }
    //       }
    //       video.onerror = function () {
    //         video = null
    //         reject({
    //           key: index,
    //           value: item
    //         })
    //       }
    //     } else {
    //       i++
    //       if (i === len) {
    //         resolve()
    //       }
    //     }
    //   })
    // })
  }

  /**
   * 添加新的中插地址
   * @private
   */
  addVideo = () => {
    const { form } = this.props;
    const videoListIndex = form.getFieldValue('videoListIndex');
    videoListIndex.push({
      key: _.uniqueId(),
      source: '',
      link: '',
      ex: 0,
      monitorUrl: [],
    });
    form.setFieldsValue({
      videoListIndex,
    });
  }

  /**
   * 删除中插
   * @param index
   * @private
   */
  removeVideo = (index) => {
    const { form } = this.props;
    const videoListIndex = form.getFieldValue('videoListIndex');
    const videoList = form.getFieldValue('videoList');
    videoListIndex.splice(index, 1);
    videoList.splice(index, 1);

    form.setFieldsValue({
      videoListIndex,
      videoList,
    });
  }


  /**
   * skin change
   * @param index
   * @private
   */
  onSkinChange = (index) => {
    const { styleConfig } = this.props;
    const { data } = this.state;

    const styleList = _(config).filter((item) => {
      return _(styleConfig.VideoAds.style).indexOf(item.style) >= 0;
    }).value();

    data.style = styleList[index].style;
    this.setState({ data });
  }

  render() {
    const prefix = 'video-ads-resource';

    const { isCreated, onCancel, form, disabled, styleConfig } = this.props;
    const { loading, data } = this.state;
    const { onOk, addVideo, removeVideo } = this;


    const styleList = _(config).filter((item) => {
      return _(styleConfig.VideoAds.style).indexOf(item.style) >= 0;
    }).value();

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    };
    const notRequiredFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const listFormItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      required: true,
    };

    const modalProps = {
      disabled,
      isCreated,
      title: _.get(_.find(styleList, item => item.style === data.style), 'type'),
      skinTypeList: styleList,
      skin: _.findIndex(styleList, item => item.style === data.style),
      onCancel,
      onOk,
      loading,
    };

    form.getFieldDecorator('videoListIndex', {
      initialValue: data.videoList,
    });

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
                  disabled={disabled}
                  placeholder="请输入广告标题"
                  style={{ width: '250px' }}
                />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="视频总时间"
            >
              {
                form.getFieldDecorator('totalEx', {
                  initialValue: data.totalEx,
                  rules: [{
                    type: 'number',
                    required: true,
                    message: '视频总时间不合法',
                  }],
                })(<InputNumber
                  disabled={disabled}
                  min={0}
                />)
              }
            </FormItem>

            {/* 是否启用画中画 */}
            <div styleName={`${prefix}-ispip-container`}>
              <Row>
                <Col push={6} span={10}>
                  {
                    form.getFieldDecorator('isPiP', {
                      valuePropName: 'checked',
                      initialValue: data.isPiP,
                      rules: [],
                    })(<Checkbox
                      disabled={disabled}
                    >
                      使用画中画功能
                    </Checkbox>)
                  }
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col push={6} span={18}>
                  <Row>
                    <Col span={8} style={{ lineHeight: '28px' }}>
                      {
                        form.getFieldDecorator('allowClose', {
                          valuePropName: 'checked',
                          initialValue: data.allowClose,
                          rules: [],
                        })(<Checkbox
                          disabled={disabled}
                        >
                          用户可关闭
                        </Checkbox>)
                      }

                    </Col>
                    <Col span={16}>
                      <div style={{ display: 'inline-block' }}>
                        关闭时间：
                        {
                          form.getFieldDecorator('closeTime', {
                            initialValue: data.closeTime,
                            rules: [{
                              type: 'number',
                              required: true,
                              message: '关闭时间不合法',
                            }],
                          })(<InputNumber
                            min={0}
                            disabled={disabled || !form.getFieldValue('allowClose')}
                            // onInput={(e) => {
                            //   setFieldsValue({
                            //     'closeTime': parseInt(!/\d+/.test(e.target.value) ? 0 : /\d+/.exec(e.target.value)[0])
                            //   })
                            // }}
                          />)
                        }
                        秒
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col push={6} span={18}>
                  <Row>
                    <Col span={8} style={{ lineHeight: '28px' }}>
                      {
                        form.getFieldDecorator('usePlayerVolume', {
                          valuePropName: 'checked',
                          initialValue: data.usePlayerVolume,
                          rules: [],
                        })(<Checkbox
                          disabled={disabled}
                        >
                          使用系统播放器音量
                        </Checkbox>)
                      }
                    </Col>
                  </Row>

                </Col>
              </Row>
              {
                !form.getFieldValue('usePlayerVolume')
                && <Row>
                  <Col push={6} span={18}>
                    <div style={{ display: 'inline-block' }}>
                      <span style={{ verticalAlign: 'middle', lineHeight: '32px' }}>播放音量：</span>
                      <FormItem style={{ display: 'inline-block' }}>
                        {
                          form.getFieldDecorator('volume', {
                            initialValue: data.volume,
                            rules: [{
                              type: 'number',
                              required: true,
                              message: '音量播放不合法',
                            }],
                          })(<InputNumber
                            min={0}
                            max={100}
                            disabled={disabled || form.getFieldValue('usePlayerVolume')}
                          />)
                        }
                      </FormItem>
                      <span style={{ verticalAlign: 'middle', lineHeight: '32px' }}> %</span>
                    </div>
                  </Col>
                </Row>
            }
            </div>
            <FormItem
              label="视频列表"
              {...notRequiredFormItemLayout}
            >
              {
                !disabled
                && <Button
                  onClick={addVideo}
                  type="primary"
                >
                  添加视频
                </Button>
              }
            </FormItem>
            {
              form.getFieldValue('videoListIndex').map((item, index) => {
                return (
                  <div
                    key={index}
                    styleName={`${prefix}-video-list`}
                  >
                    <div
                      styleName={`${prefix}-video-list-title`}
                    >
                      {`内容${index + 1}`}
                    </div>
                    {
                      !disabled
                      && <div
                        styleName={`${prefix}-video-list-btn`}
                      >
                        <Button
                          onClick={() => removeVideo(index)}
                          type="primary"
                        >
                          删除
                        </Button>
                      </div>
                    }
                    <div styleName={`${prefix}-video-list-item`}>
                      <FormItem
                        {...listFormItemLayout}
                        label="视频地址"
                      >
                        {
                          form.getFieldDecorator(`videoList[${index}].source`, {
                            initialValue: data.videoList[index].source,
                            rules: [{
                              type: 'string',
                              required: true,
                              message: '视频地址不能为空',
                            }, {
                              pattern: reg.httpRegWithProtocol,
                              message: '视频地址不合法',
                            }],
                          })(<Input
                            disabled={disabled}
                            style={{ width: '400px' }}
                          />)
                        }
                      </FormItem>
                      <FormItem
                        {...listFormItemLayout}
                        required
                        label="视频外链"
                      >
                        {
                          form.getFieldDecorator(`videoList[${index}].link`, {
                            initialValue: data.videoList[index].link,
                            rules: [{
                              type: 'string',
                              required: true,
                              message: '视频外链不能为空',
                            }, {
                              pattern: reg.httpRegWithProtocol,
                              message: '视频外链不合法',
                            }],
                          })(<Input
                            style={{ width: '400px' }}
                            disabled={disabled}
                          />)
                        }
                      </FormItem>

                      <FormItem
                        {...listFormItemLayout}
                        required
                        label="视频时间"
                      >
                        {
                          form.getFieldDecorator(`videoList[${index}].ex`, {
                            initialValue: data.videoList[index].ex,
                            rules: [{
                              type: 'number',
                              required: true,
                              message: '视频时间不合法',
                            }],
                          })(<InputNumber
                            disabled={disabled}
                            min={0}
                          />)
                        }
                      </FormItem>

                      <FormItem
                        {...listFormItemLayout}
                        label="监测代码"
                      >
                        <MonitorUrl
                          disabled={disabled}
                          ctx={`videoList[${index}].monitorUrl`}
                          monitorUrlList={data.videoList[index].monitorUrl}
                        />
                      </FormItem>
                    </div>
                  </div>
                );
              })
            }
          </Form>
        </div>
      </ResourceModal>
    );
  }
}
