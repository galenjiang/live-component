//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
// 'use strict'
// official
import React, { Component, PropTypes } from 'react'

// Third-part
import {
  Modal,
  Form,
  Button,
  Checkbox,
  Row,
  Select,
  Col,
  Radio,
  DatePicker,
  Tooltip,
  message,
  Icon,
  InputNumber,
  Upload,
} from 'antd'
import moment from 'moment'
import _ from 'lodash'
import classNames from 'classnames'
// mine
import AdsBallModel from '../DragBallModel'
import decorator from '../../libs/decorator/decorator.ant.form'
import { constantsAdsMap } from '../../constants'
import '../../less/animation/animations.less'
import './PutAdsMedel.less'

const Option = Select.Option
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group



const actionList = [
  {
    name: '自动投放',
    value: '1',
  },
  {
    name: '手动投放',
    value: '2',
  },
  // {
  //   name: '任务投放',
  //   value: '3'
  // },
]

const platformList = [{
  label: 'web',
  value: 'web',
}, {
  label: 'ios',
  value: 'ios',
}, {
  label: 'android',
  value: 'android',
}]

@decorator()
export default class AdsPutModal extends Component {

  static defaultProps = {
    data: {},
    onCancel() {
    },
    onOk() {
    },
    title: '投放图片球',
  }


  static propTypes = {
    data: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    anchorList: PropTypes.array.isRequired,
  }

  static formatTimeString(str) {
    const rows = str.match(/.+/g)

    return _(rows)
      .map(row => _.map(row.split(','), (cell, index) => {
        if (index !== 2) {
          return moment(cell.trim())
        }
        return cell.trim()
      }))
      .value()
  }


  constructor(props) {
    super(props)

    this.state = {
      btnLoading: false,
      putData: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        screenType: 0,
        action: '1',                            // 投放方式选择
        actionType: 0,
        timeEnd: null,
        isCycle: false,                        // 是否循环间隔出现
        cycleOption: {
          interval: 1,                        // min 分 间隔时间
          frequency: 0,                        // 循环次数 0 为永久
        },
        checkedPlatform: ['web', 'ios', 'android'],
        putAddrAllOrNot: 1,                    // 投放全部房间0， 分别投放1
        putAddr: [],                           // 投放房间
        pushOnly: 0,                          // (default: false) 只推送显示
        ex: 0,                                // 热点存在时间 0 表示永远存在
        isCloseBtnAppearShow: true,
        closeBtnAppear: 5,                    // 默认5秒后关闭
        animation: 0,
        customizeDisplayDate: [],

        // putTime: 2,                           //投放时间选择 默认头投放时间 不选择
        // allDisabled: true,                    // 如果投放方式选择了是即使投放的时候,其他的都有disabled
        // frequency: 0,
        // interval: 0,
        // rotate: 0,                            // 0 水平 1 垂直
        // puttingAddrArray: [],
      },
    }

    // 指定投放时间
    // this.putTimeDate = undefined
    // this.startData = new Date().getTime()

    // 投放地址选择
    // const putAddrMap = {0: '@all'}
    // this.putAddrMap = putAddrMap
  }



  componentDidMount() {
    // 获取主播列表
    const { getAnchorList } = this.props
    getAnchorList()
  }

  componentWillReceiveProps(nextProps) {
    const { visible, data } = nextProps

    if (visible === true) {
      // // 其他删除字段
      // delete this.canDrag
      // delete this.canResize

      let canResize
      let canDrag
      if (data.isPiP) {
        // 视频广告是否可以拖拽
        canDrag = true
        canResize = true
      }
      if (!data.__t) {
        message.error('系统错误，投放类型不存在')
        return false
      }
      const ballConfig = constantsAdsMap[data.__t]

      const defaultConfig = {
        canResize: ballConfig.canResize,
        canDrag: ballConfig.canDrag,
      }

      const config = _.defaults({
        canDrag,
        canResize,
      }, defaultConfig)

      this.canDrag = config.canDrag
      this.canResize = config.canResize

      message.info(`注意:当前投放广告,${ballConfig.value}${config.canDrag ? '支持' : '目前不支持'}拖拽,${config.canResize ? '支持' : '目前不支持'}缩放`, 3)

      this.setState({
        data: nextProps.data,
      })
    }
    return true
  }


  /**
   * 获取内部拖拽，以用于提交解除绑定
   * @param drag
   */
  getDrag = (drag, dragEle) => {
    this.Drag = drag
    this.dragEle = dragEle
  }


  /**
   * 提交投放
   * @returns {boolean}
   */
  putAdsConfirm = () => {
    const { onOk } = this.props
    const { putData } = this.state

    // 获取位置
    const dragData = this.Drag.calculatePos()

    if (!putData.checkedPlatform.length) {
      message.error('请至少选择一个投放渠道')
      return false
    }

    if (putData.actionType === 1 && !putData.timeEnd) {
      message.error('请设定特定投放时间')
      return false
    }

    if (putData.putAddrAllOrNot === 1 && !putData.putAddr.length) {
      message.error('请设定投放房间')
      return false
    }

    if (putData.ex) {
      // s not ms
      const weeklyTimeUnix = parseInt(moment().day(8).format('X'), 10)
      const now = parseInt(moment().format('X'), 10)
      if (now + putData.ex.valueOf() >= weeklyTimeUnix) {
        putData.ex = moment(weeklyTimeUnix - now)
        message.warn('投放选项错误,显示时间过长,已经自动设置为一周为最大时间周期')
      }
    }

    // 投放时间段设置
    for (let i = 0; i < putData.customizeDisplayDate.length; i++) {
      if (!putData.customizeDisplayDate[i].start || !putData.customizeDisplayDate[i].end || !putData.customizeDisplayDate[i].num) {
        message.warn(`第${i + 1}个自定义投放时间段内容未填完整`)
        return false
      }
      if (putData.customizeDisplayDate[i].end < putData.customizeDisplayDate[i].start) {
        message.warn(`第${i + 1}个自定义投放时间段结束时间不能早于开始时间`)
        return false
      }
    }
    if (!_.reduce(
        putData.customizeDisplayDate,
        (previousEnd, item, index) => {
          if (previousEnd > item.start.valueOf()) {
            message.warn(`第${index + 1}个时间段开始时间不能早于上一个时间段结束时间`)
            return false
          }
          return item.end.valueOf()
        }, 1)) {
      return false
    }
    this.Drag && this.Drag.removeListener()

    this.setState({
      btnLoading: false,
    })


    const sortedcheckedPlatform = {}
    platformList.forEach((item) => {
      sortedcheckedPlatform[item.value] = putData.checkedPlatform.indexOf(item.value) >= 0
    })

    // sorting
    const sortdCustomizeDisplayDate = _.map(putData.customizeDisplayDate, item => ({
      start: item.start.valueOf(),
      end: item.end.valueOf(),
      num: item.num,
    }),
    )

    const submitData = _.omitBy({
      ..._.pick(putData, ['screenType', 'actionType', 'isCycle', 'cycleOption', 'pushOnly', 'ex', 'animation']),
      ...dragData,
      ...sortedcheckedPlatform,
      action: parseInt(putData.action, 10),
      timeEnd: putData.actionType === 1 ? putData.timeEnd.valueOf() : undefined,
      putAddr: putData.putAddrAllOrNot === 0 ? '@all' : putData.putAddr.join(','),
      closeBtnAppear: putData.isCloseBtnAppearShow ? putData.closeBtnAppear : -1,
      customizeDisplayDate: sortdCustomizeDisplayDate,
    }, _.isNil)

    onOk(
      // Object.assign(
      //   data,
      //   { putTiming: timeConfigure },
      //   //中插,投票不要显示出 显示 显示时间
      //   (this.state.data.__t !== 'VideoAds' && this.state.data.__t !== 'VoteAds') ? { ex } : {},
      //   addrConfigure,
      //   //投票球 不添加 只推送显示
      //   this.state.data.__t !== 'VoteAds' ? { pushOnly: Boolean(pushOnly) } : {},
      //   { action: Number(action) },
      //   { customizeDisplayDate: sorttdCustomizeDisplayDate },
      //   { animation },
      //   { screenType: rotate },  //TODO 增加横竖屏
      //   putData
      // )
      submitData,
    )
      .then(() => {
        // const { putData } = this.state
        putData.customizeDisplayDate = []
        this.setState({
          btnLoading: false,
          putData,
        })
      })
    return false
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel.call(this)
  }

  handleAddCustomedPuttingTimeSetting = () => {
    const { putData } = this.state
    putData.customizeDisplayDate.push({
      key: `${new Date().getTime()}${Math.random()}`,
      start: putData.customizeDisplayDate.length === 0
      ? moment()
      : moment(putData.customizeDisplayDate[putData.customizeDisplayDate.length - 1].end.valueOf() + 1000), // 起始时间戳
      end: putData.customizeDisplayDate.length === 0
      ? moment()
      : moment(putData.customizeDisplayDate[putData.customizeDisplayDate.length - 1].end.valueOf() + 1000), // 截止时间戳
      num: 1,  // 投放次数
    })
    this.setState({
      putData,
    })
  }

  handleremoveCustomedPuttingTimeSetting(index) {
    const { putData } = this.state
    putData.customizeDisplayDate.splice(index, 1)
    this.setState({
      putData,
    })
  }

  handleCustomedPuttingTimeStartSetting(index, date) {
    const { putData } = this.state
    putData.customizeDisplayDate[index].start = date
    this.setState({
      putData,
    })
  }

  handleCustomedPuttingTimeEndSetting(index, date) {
    const { putData } = this.state
    putData.customizeDisplayDate[index].end = date
    this.setState({
      putData,
    })
  }

  handleCustomedPuttingTimeNumSetting(index, value) {
    const { putData } = this.state
    putData.customizeDisplayDate[index].num = value
    this.setState({
      putData,
    })
  }

  setField = (path, value, cb) => {
    const { putData } = this.state
    _.set(putData, path, value)
    this.setState({
      putData,
    }, () => {
      cb && cb()
    })
  }

  uploadCustomizeDisplayDate = (file) => {
    const { putData } = this.state
    putData.customizeDisplayDate = []
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
       _(AdsPutModal.formatTimeString(e.target.result))
        .forEach((row) => {
          putData.customizeDisplayDate.push({
            key: `${new Date().getTime()}${Math.random()}`,
            start: row[0],
            end: row[1],
            num: row[2],
          })
        })

      this.setState({
        putData,
      })
    
    }
    fileReader.readAsText(file, 'UTF-8')
  }



  render() {
    const prefixClassName = 'ads-put-modal'
    const { title, data, visible, anchorList } = this.props
    const { btnLoading, putData } = this.state
    const { getDrag, setField, putAdsConfirm, onCancel, uploadCustomizeDisplayDate } = this

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
    }
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }

    const animationList = [{
      index: 0,
      animation: '无'
    }, {
      index: 1,
      animation: '淡入'
    }, {
      index: 2,
      animation: '放大'
    }, {
      index: 3,
      animation: '翻转'
    }, {
      index: 4,
      animation: '呼吸'
    }, {
      index: 5,
      animation: '弹跳'
    }, {
      index: 6,
      animation: '刀光'
    }, {
      index: 7,
      animation: '摆动'
    }, {
      index: 8,
      animation: '波纹'
    }, {
      index: 9,
      animation: '声波'
    }]

    const footer = (
      <div>
        {
          /**
           * 按钮
           */
        }
        <Button
          type="primary"
          loading={btnLoading}
          onClick={putAdsConfirm}
        >
          投放广告
        </Button>
      </div>
    )
    let PutBody = null
    if (data.__t) {
      PutBody = ((data) => {
        switch (data.__t) {
          case 'TextAds':
            return (
              <p
                className={`${prefixClassName}-text-ads`}
                style={{
                  padding: '5px',
                  fontSize: '14px',
                  overflow: 'hidden',
                }}
              >
                {data.textList[0].content}
              </p>
            )
          case 'VoteAds':
            let iconStyle = { display: 'none' }
            if (Number(data.style) === 2) {
              iconStyle = { backgroundImage: `url("${data.titlePic}")` }
            }
            return (
              <div
                className={`${prefixClassName}-drag-origin voteAd-${data.style}-style`}
              >
                <div
                  className={`${prefixClassName}-drag-origin-icon`}
                  style={iconStyle}
                >
                </div>
                <p>{data.title}</p>
              </div>
            )
          case 'VideoAds':
            return (
              <video
                autoPlay
                loop
                src={data.videoList[0].source}
                style={{
                  width: '100%',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )
          default:
            return (
              <img
                alt="pictrue"
                className={`${prefixClassName}-picture-ads`}
                draggable="false"
                style={{ width: '100%' }}
                src={`${data.pic || ''}`}
              />
            )
        }
      })(data)
    }

    // 文字广告特殊处理  默认width: 70px
    let dragBodyStyle = {
      fontSize: 0,
      overflow: 'hidden',
    }
    if (data.__t === 'TextAds' || data.__t === 'VoteAds') {
      dragBodyStyle = {
        ...dragBodyStyle,
        width: 'auto',
      }
    }
    if (data.__t === 'VideoAds') {
      dragBodyStyle = {
        ...dragBodyStyle,
        width: '100%',
        height: '100%',
      }
    }


    const disabledDate = (value) => {
      if (!value) {
        return false
      }
      return value.valueOf() <= new Date().setHours(0, 0, 0, 0)
    }

    return (
      // <div data-react-component="consoleModalAdsPut">
      <div>
        <Modal
          title={title}
          visible={visible}
          onCancel={onCancel}
          wrapClassName={`${prefixClassName} ${putData.screenType === 0 ? 'Horizontally' : 'vertically'}`}
          width={900}
          maskClosable={false}
          footer={footer}
        >
          <div>
            <p>广告定位</p>
            <span>
              <RadioGroup
                defaultValue={putData.screenType}
                onChange={e => setField('screenType', e.target.value, () => {
                  this.dragEle.style.top = 0
                  this.dragEle.style.left = 0
                })}
              >
                <Radio
                  key={0}
                  value={0}
                >
                  横屏
                </Radio>
                <Radio
                  key={1}
                  value={1}
                >
                  竖屏
                </Radio>
              </RadioGroup>
            </span>

            {/* 广告预览 */}
            <div
              className={`${prefixClassName}-content`}
            >
              {
                visible &&
                <AdsBallModel
                  getDrag={getDrag}
                  dragBodyStyle={dragBodyStyle}
                  canResize={this.canResize}
                  canDrag={this.canDrag}
                >
                  {/* 拖拽本体，定制化 */}
                  {PutBody}
                </AdsBallModel>
              }
            </div>

            {/* 广告配置 */}
            <div className={`${prefixClassName}-configure`}>
              <Row>
                {/* 左侧内容 */}
                <Col
                  span={10}
                >
                  <FormItem
                    {...formItemLayout}
                    label="投放渠道"
                  >
                    <CheckboxGroup
                      options={platformList}
                      value={putData.checkedPlatform}
                      onChange={value => setField('checkedPlatform', value)}
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="投放方式"
                  >
                    <Select
                      value={putData.action}
                      style={{ width: '100%' }}
                      onChange={value => setField('action', value)}
                    >
                      {
                        actionList.map(item => <Option
                          value={item.value}
                          key={item.value}
                        >
                          {item.name}
                        </Option>)
                      }
                    </Select>
                  </FormItem>
                  <FormItem
                    style={{ marginLeft: '30px' }}
                  >
                    <RadioGroup
                      value={putData.actionType}
                      onChange={e => setField('actionType', e.target.value)}
                    >
                      <Radio
                        key={0}
                        value={0}
                        style={radioStyle}
                      >
                        直接投放
                      </Radio>
                      <Radio
                        key={1}
                        value={1}
                        style={radioStyle}
                      >
                        特定时间投放&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {/* 投放时间 */}
                        <DatePicker
                          value={putData.timeEnd}
                          disabledDate={disabledDate}
                          disabled={putData.actionType !== 1}
                          onChange={value => setField('timeEnd', value)}
                          format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择时间"
                          showTime
                        />
                      </Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="投放地址"
                  >
                    <RadioGroup
                      onChange={e => setField('putAddrAllOrNot', e.target.value)}
                      value={putData.putAddrAllOrNot}
                    >
                      <Radio
                        key={0}
                        value={0}
                        style={radioStyle}
                      >
                        通投全平台
                      </Radio>
                      <Radio
                        key={1}
                        value={1}
                        style={radioStyle}
                      >
                        通投特定房间
                      </Radio>
                    </RadioGroup>

                    <Select
                      value={putData.putAddr}
                      multiple
                      disabled={putData.putAddrAllOrNot === 0}
                      style={{ width: '100%' }}
                      placeholder="请选择主播(主播id)，可以多选"
                      onChange={value => setField('putAddr', value)}
                      notFoundContent="未找到主播id"
                    >
                      {anchorList.map(item => <Option
                        value={item.platformUserId}
                        key={item._id}
                      >
                        {`${item.username}(id:${item.platformUserId})`}
                      </Option>)}
                    </Select>

                  </FormItem>
                  {
                    (data.__t === 'PicAds' || data.__t === 'HongBaoAds' || data.__t === 'TextAds')
                    && <FormItem>
                      <div style={{ marginLeft: '30px' }}>
                        <Checkbox
                          checked={putData.isCloseBtnAppearShow}
                          onChange={e => setField('isCloseBtnAppearShow', e.target.checked)}
                        >
                          可关闭
                        </Checkbox>
                        {
                          putData.isCloseBtnAppearShow
                          && (
                            <span>
                              <InputNumber
                                min={0}
                                value={putData.closeBtnAppear}
                                onChange={value => setField('closeBtnAppear', value)}
                              />
                              &nbsp;秒出现关闭按钮
                          </span>
                          )
                        }

                      </div>
                    </FormItem>
                  }

                  {
                    data.__t !== 'VoteAds' &&
                    <FormItem
                      {...formItemLayout}
                    >
                      <div
                        style={{ marginLeft: '30px' }}
                      >
                        <div
                          style={{ display: 'inline-block' }}
                        >
                          <Checkbox
                            checked={putData.pushOnly}
                            onChange={e => setField('pushOnly', e.target.checked)}
                          >
                            只推送显示
                          </Checkbox>
                        </div>
                        &nbsp;&nbsp;
                        <Tooltip
                          title="勾选代表切换直播间不显示，不勾选在持续时间内切换直播间也能看到"
                        >
                          <Icon type="question-circle" />
                        </Tooltip>
                      </div>
                    </FormItem>
                  }

                </Col>
                {
                  /**
                   * 右侧内容
                   */
                }
                <Col
                  span={14}
                  style={{
                    textAlign: 'left',
                    paddingLeft: '5%',
                  }}
                >
                  {/* 显示时长 */}
                  {
                    data.__t !== 'VideoAds' && data.__t !== 'VoteAds'
                    && <FormItem>
                      <span>显示时长:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <div
                        style={{
                          display: 'inline-block',
                          width: '100px',
                        }}
                      >
                        <InputNumber
                          value={putData.ex}
                          min={0}
                          onChange={value => setField('ex', value)}
                        />
                      </div>
                        &nbsp;
                        秒
                        &nbsp;&nbsp;
                        <Tooltip
                          title="0代表一直显示，超过0秒代表实际存在时间。"
                        >
                          <Icon
                            type="question-circle"
                          />
                        </Tooltip>
                    </FormItem>
                  }
                  {/* 是否间隔投放 */}
                  <FormItem>
                    <Checkbox
                      checked={putData.isCycle}
                      onChange={e => setField('isCycle', e.target.checked)}
                    >
                      间隔频次投放
                    </Checkbox>
                  </FormItem>
                  {
                    putData.isCycle
                    && <div
                      className={`${prefixClassName}-putTime`}
                    >
                      <div>
                        <span>每隔</span>
                        <InputNumber
                          value={putData.cycleOption.interval}
                          min={1}
                          placeholder="请输入投放频率"
                          onChange={value => setField('cycleOption.interval', value)}
                        />
                        &nbsp;分钟投放一次
                      </div>
                      <div
                        style={{ marginTop: '15px' }}
                      >
                        <span>总投放</span>
                        <InputNumber
                          value={putData.cycleOption.frequency}
                          min={0}
                          onChange={value => setField('cycleOption.frequency', value)}
                          placeholder="请输入总投放次数"
                        />&nbsp;次&nbsp;&nbsp;&nbsp;
                        <Tooltip
                          title="0代表一直投放，大于0次就投放固定次数"
                        >
                          <Icon type="question-circle" />
                        </Tooltip>
                      </div>
                    </div>
                  }
                </Col>

                {/* 下方配置 */}
              </Row>
              {
                ((data.__t === 'PicAds') || (data.__t === 'TextAds')) &&
                <div className={`${prefixClassName}-effect`}>
                  <span className={`${prefixClassName}-effect-title`}>投放特效:</span>
                  <div className={`${prefixClassName}-effect-body`}>
                    {
                      _(animationList)
                        .reject(item => (item.animation === (data.__t === 'PicAds' ? '呼吸' : null)))
                        .value()
                        .map(item => (<span
                          key={item.index}
                          className={classNames({
                            [`${prefixClassName}-effect-item`]: true,
                            active: putData.animation === item.index,
                          })}
                          onClick={() => { setField('animation', item.index) }}
                        >
                          {item.animation}
                        </span>))
                    }
                  </div>
                </div>
              }
              <div className={`${prefixClassName}-puttime-wrapper`}>
                <p className={`${prefixClassName}-puttime-title`}>投放自定义显示时间段设置：</p>
                {
                  putData.customizeDisplayDate.length !== 0 &&
                  <Form horizontal className={`${prefixClassName}-puttime-content`}>
                    {putData.customizeDisplayDate.map((item, index) => {
                      return (

                        <FormItem key={item.key}>
                          <Col span={3}>
                            <p
                              style={{ textIndent: '10px' }}
                            >
                              在开始时间</p>
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              style={{ width: '150px' }}
                              value={item.start}
                              showTime
                              format="YYYY-MM-DD HH:mm:ss"
                              placeholder="请选择时间"
                              onChange={(date) => {
                                this.handleCustomedPuttingTimeStartSetting(index, date)
                              }}
                            />
                          </Col>
                          <Col span={3}>
                            <p>到结束时间</p>
                          </Col>
                          <Col span={6}>
                            <DatePicker
                              style={{ width: '150px' }}
                              value={item.end}
                              showTime
                              format="YYYY-MM-DD HH:mm:ss"
                              placeholder="请选择时间"
                              onChange={(date) => {
                                this.handleCustomedPuttingTimeEndSetting(index, date)
                              }}
                            />
                          </Col>
                          <Col span={2}>
                            <p>内显示</p>
                          </Col>
                          <Col span={2}>
                            <InputNumber
                              style={{ width: '55px' }}
                              value={item.num}
                              min={1}
                              onChange={(value) => {
                                this.handleCustomedPuttingTimeNumSetting(index, value)
                              }}
                            />
                          </Col>
                          <Col span={1}>
                            <p>次</p>
                          </Col>
                          <Col span={1}>
                            <div
                              className={`${prefixClassName}-puttime-item-close`}
                              onClick={() => {
                                this.handleremoveCustomedPuttingTimeSetting(index)
                              }}
                            >
                              <Icon type="cross-circle-o" />
                            </div>
                          </Col>
                        </FormItem>

                      )
                    })}

                  </Form>

                }
                <div className={`${prefixClassName}-puttime-footer`}>
                  <Button onClick={this.handleAddCustomedPuttingTimeSetting} type="primary">添加时间段</Button>
                    <a
                      style={{marginLeft: '15px'}}
                      download={'sample.txt'}
                      href="http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/assets/timeformat-sample.txt">
                      <Button>
                        <Icon type="download"/>
                        下载示例
                      </Button>
                    </a>
                    <Upload
                      style={{marginLeft: '15px'}}
                      beforeUpload={uploadCustomizeDisplayDate}
                    >
                      <Button>
                        <Icon type="upload" /> 点击上传时间段
                      </Button>
                    </Upload>
                  
                </div>
              </div>

            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
