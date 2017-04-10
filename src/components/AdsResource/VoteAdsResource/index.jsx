// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// Third-part
import { message } from 'antd';
import _ from 'lodash';

// mine
import Basic from './VoteAdsForm/Basic';
import Flat from './VoteAdsForm/Flat';
import Tech from './VoteAdsForm/Tech';
import MangoCool from './VoteAdsForm/MangoCool';
import MangoClassic from './VoteAdsForm/MangoClassic';
import IWantBasic from './VoteAdsForm/IWantBasic';
import IWantFlat from './VoteAdsForm/IWantFlat';
import ResourceModal from '../../ResourceModal';
import config from './config';
import event from '../../../utils/event';
import style from './style.M.less';

@CSSModule(style)
export default class VoteAdsResource extends Component {
  static propTypes = {
    data: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
  }
  static propTypes = {
  }

  static defaultProps = {
    data: {},
    styleConfig: {
      VoteAds: {
        style: config.map(item => item.style),
      },
    },
  }

  constructor(props) {
    super();
    const { data } = props;

    const modelConfig = {
      __t: 'VoteAds',
      style: 0,                       // 样式
      voteRepeat: false,              // 是否允许重复投票
      qoptionsType: 0,                // 选项类型 0: 百分比 1: 纯数字
      titlePic: '',                   // 标题图片地址
      votePic: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/common/banner-come-on-vote.png',                           // 标题图片地址
      title: '',                      // 标题
      url: '',                        // 外链
      multiple: 1,                    // 倍数
      specifyIdx: '-1',
      upPlace: 0,                     // 向上位移
      monitorUrl: [],
      votePicMonitorUrl: [],
      qoptions: [{
        key: _.uniqueId(),
        title: '',
        pic: '',
      }],
    };

    this.state = {
      loading: false,
      data: _.defaults(data, modelConfig),
    };

    // if (isCreateBall) {
    //   this.state = {
    //     loading: false,
    //     data: modelConfig
    //   }
    // } else {
    //   data.qoptions = data.qoptions.map(item => {
    //     item.key = `${new Date().getTime()}${Math.random()}`
    //     return item
    //   })
    //   const dataConfig = _.defaults(data, modelConfig)
    //   dataConfig.specifyIdx = String(dataConfig.specifyIdx)
    //   this.state = {
    //     loading: false,
    //     data: dataConfig,
    //   }

    // }
  }



  /**
   * skin change
   * @param index
   */
  onSkinChange = (index) => {
    const { styleConfig } = this.props;
    const { data } = this.state;
    const styleList = _(config).filter((item) => {
      return _(styleConfig.VoteAds.style).indexOf(item.style) >= 0;
    }).value();


    data.style = styleList[index].style;
    this.setState({ data });
  }

  // /**
  //  * 添加新的 qoptions
  //  */
  // addNewQoption = () => {
  //   const { data } = this.state
  //   if (data.qoptions.length >= 10) {
  //     message.error('投票选项最多支持10个')
  //     return false
  //   }
  //   data.qoptions.push({
  //     key: `${new Date().getTime()}${Math.random()}`,
  //     title: '',
  //     pic: '',
  //   })
  //   this.setState({ data })
  //   return false
  // }

  // /**
  //  * 移除 一个  qoptions
  //  * @param k
  //  * @param index
  //  */
  // removeQoption = (k, index) => {
  //   let { data } = this.state
  //   data.qoptions.splice(index, 1)
  //   if (parseInt(data.specifyIdx) >= data.qoptions.length) {
  //     data.specifyIdx = String(data.qoptions.length - 1)
  //   }

  //   this.setState({ data })
  // }

  /**
   * 提交的时候
   * @private
   */
  onOk = () => {
    const { onOk } = this.props;
    event.$emit('validateFields', (values, monitorUrl) => {

      const sortedmonitorUrl = _(monitorUrl)
        .map((itemUrl) => {
          const temp = _(itemUrl)
            .toPairs()
            .flatten()
            .value();
          return [temp[0], temp[1]];
        })
        .map((item) => {

          const sencond = _(item[1])
            .map((item) => ({
              [item[0]]: {
                [item[1]]: item[2],
              },
              admaster: item[3],
            }));

          return [
            item[0],
            sencond,
          ];
        })
        .fromPairs()
        .value();

      onOk({
        ...this.state.data,
        ..._(values).omit('qoptionsIndex').mapValues((value, key) => {
          if (key === 'specifyIdx') {
            return parseInt(value);
          }
          return value;
        }).value(),
        ...sortedmonitorUrl,
      });
    });
    // const data = _.cloneDeep(this.state.data)

    // let result = validate(data, _.find(voteConfig, item => item.style === data.style).validate)

    // if (!result.res) {
    //   let stackList = result.stack
    //   message.error(`${_(stackList).map(item => item.key).compact().value().join(',')}${stackList[stackList.length - 1].error}`)
    //   return false
    // }

    // if (!data.qoptions.length) {
    //   message.error('投票广告选项错误投票至少添加一个选项')
    //   return false
    // }

    // if (!monitorUrlValidate(data.monitorUrl, '热点')) {
    //   return false
    // }

    // if (!monitorUrlValidate(data.votePicMonitorUrl, '广告')) {
    //   return false
    // }

    // // 删除key
    // data.qoptions.forEach(item => {
    //   delete item.key
    // })
    // data.specifyIdx = parseInt(data.specifyIdx)

    // //开始上传数据
    // // this.setState({
    // //   loading: true
    // // }, () => {
    // //   onOk({
    // //     ...data,
    // //   })
    // // })

    // this.setState({
    //   loading: true
    // }, async() => {
    //   try{
    //     await onOk({
    //       ...data,
    //     })
    //   }catch(e){
    //     this.setState({
    //       loading: false
    //     })
    //   }
    // })
  }

  render() {
    const { onCancel, isCreated, disabled, styleConfig } = this.props;
    const { loading, data } = this.state;
    const { onSkinChange, onOk } = this;

    const styleList = _(config).filter((item) => {
      return _(styleConfig.VoteAds.style).indexOf(item.style) >= 0;
    }).value();


    const modalProps = {
      disabled,
      isCreated,
      title: _.get(_.find(styleList, item => item.style === data.style), 'type'),
      skinTypeList: styleList,
      skin: _.findIndex(styleList, item => item.style === data.style),
      onSkinChange,
      onCancel,
      onOk,
      loading,
    };

    // let voteConfigItem = config.find(item => item.style === style).validate


    // 科技风不能选择数据，重置选项
    if (data.style === 2) {
      data.qoptionsType = 0;
    }

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
          (data.style === 1)
          && <Flat
            {...this.props}
            data={data}
          />
        }
        {
          data.style === 2
          && <Tech
            {...this.props}
            data={data}
          />
        }
        {
          data.style === 101
          && <MangoCool
            {...this.props}
            data={data}
          />
        }
        {
          data.style === 102
          && <MangoClassic
            {...this.props}
            data={data}
          />
        }
        {
          data.style === 10200
          && <IWantBasic
            {...this.props}
            data={data}
          />
        }

        {
          data.style === 10201
          && <IWantFlat
            {...this.props}
            data={data}
          />
        }
        {/*<div className={prefix}>
          // 基础选项
          <section className={`${prefix}-configure-title`}>
            <Checkbox
              checked={data.voteRepeat}
              onChange={e => this.__setFields(null, 'voteRepeat', e.target.checked)}
            >允许重复投票</Checkbox>
            <span>
                <span style={{ display: 'inline-block', margin: '0 5px 0 15px' }}>选项显示方式:</span>
                  <Radio.Group
                    onChange={e => this.__setFields(null, 'qoptionsType', e.target.value)}
                    value={data.qoptionsType}
                  >
                    <Radio key={0} value={0}>百分比</Radio>
                    // 科技风不能选数字
                    <Radio disabled={style === 2} key={1} value={1}>数字</Radio>
                  </Radio.Group>
              </span>
          </section>

          // 投票字段
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="热点图片">
                <div
                  className={{
                    [`${prefix}-title-crop`]: true
                  }}
                  style={{
                    width: '200px',
                    height: `${200 / voteConfigItem.titlePic.cropConfig.cropOptions.aspect || 150}px`
                  }}
                >
                  <ImageUploader
                    {...voteConfigItem.titlePic.cropConfig}
                    fileURL={data.titlePic}
                    onUploadChange={url => this.__setFields(null, 'titlePic', url)}
                  />
                </div>
              </FormItem>

            </Col>
            <Col span={16}>
              <FormItem
                {...formItemLayout}
                label="投票标题">
                <Input
                  style={{ width: '250px' }}
                  type="text"
                  value={data.title}
                  onChange={(e) => {
                    this.__setFields(null, 'title', e.target.value)
                  }}
                />

              </FormItem>
              <FormItem
                {...formItemLayoutNotRequired}
                label="外链地址">
                <Input
                  type="url"
                  value={data.url}
                  onChange={e => this.__setFields(null, 'url', e.target.value)}/>
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="投票倍数">
                <InputNumber
                  style={{ style: '250px' }}
                  min={0}
                  value={data.multiple}
                  onChange={value => this.__setFields(null, 'multiple', value)}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="指定结果"
              >
                <Select
                  onChange={value => this.__setFields(null, 'specifyIdx', value)}
                  value={data.specifyIdx}
                  style={{ width: '250px' }}
                >
                  <Option value={'-1'} key={-1}>无</Option>
                  {
                    data.qoptions.map((item, index) => {
                      return (
                        <Option value={String(index)} key={item.key}>{`选项${index + 1}： ${item.title}`}</Option>
                      )
                    })
                  }
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="投票向上位移值">
                <InputNumber
                  style={{ style: '250px' }}
                  placeholder="投票向上位移量，单位px"
                  value={data.upPlace}
                  onChange={value => this.__setFields(null, 'upPlace', value)}
                />
              </FormItem>
            </Col>
          </Row>
          // 监测代码
          <Row>

            <FormItem
              {...voteLayout}
              label="监测代码">
              <MonitorUrl
                monitorUrlList={data.monitorUrl}
                onChange={setMonitorUrl}
              />
            </FormItem>
            <FormItem
              {...voteLayout}
              label="广告图片">
              <div
                className={{
                  [`${prefix}-vote-crop`]: true
                }}
                style={{
                  width: '200px',
                  height: `${200 / voteConfigItem.votePic.cropConfig.cropOptions.aspect || 150}px`
                }}
              >
                <ImageUploader
                  {...voteConfigItem.votePic.cropConfig}
                  fileURL={data.votePic}
                  onUploadChange={url => this.__setFields(null, 'votePic', url)}
                />
              </div>
            </FormItem>

            <FormItem
              {...voteLayout}
              label="监测代码">
              <MonitorUrl
                monitorUrlList={data.votePicMonitorUrl}
                onChange={setVoteMonitorUrl}
              />
            </FormItem>
          </Row>
          // 投票额外选项
          <section className={`${prefix}-configure-qoptions`}>
            <Row>
              {
                data.qoptions.map((item, index) => {
                  return (
                    <Col key={item.key} span={11} push={(index + 1) % 2 === 0 ? 2 : 0}>
                      <div className={`${prefix}-configure-qoptions-list`}>
                        <div className={`${prefix}-configure-qoptions-delete`}>
                          <Icon
                            onClick={() => removeQoption(item, index)}
                            type="delete"
                          />
                        </div>
                        <p>选项{index + 1}</p>
                        <div className={`${prefix}-configure-qoptions-detail`}>
                          <FormItem
                            {...formItemLayoutQoptions}
                            wrapperCol={{ span: 12 }}
                            label="投票图片">
                            <div
                              className={{
                                [`${prefix}-option-crop`]: true
                              }}
                              style={{
                                width: '200px',
                                height: `${200 / voteConfigItem.qoptions.items[0].properties.pic.cropConfig.cropOptions.aspect || 150}px`
                              }}
                            >
                              <ImageUploader
                                {...voteConfigItem.qoptions.items[0].properties.pic.cropConfig}
                                fileURL={item.pic}
                                onUploadChange={url => this.__setFields('qoptions', 'pic', url, index)}
                              />
                            </div>
                          </FormItem>
                          <FormItem
                            {...formItemLayoutQoptions}
                            label="选项标题">
                            <Input
                              value={item.title}
                              onChange={e => this.__setFields('qoptions', 'title', e.target.value, index) }
                            />
                          </FormItem>
                        </div>
                      </div>
                    </Col>
                  )
                })
              }
            </Row>
            <Row>
              <Col span={12} style={{ padding: '0 4%' }}>
                <Button
                  type="ghost"
                  style={{ width: '100%' }}
                  onClick={addNewQoption}>
                  添加内容
                </Button>
              </Col>
            </Row>
          </section>
        </div>*/}
      </ResourceModal>
    )
  }
}
