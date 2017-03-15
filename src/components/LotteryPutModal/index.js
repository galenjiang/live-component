'use strict'
//official
import React, { Component, PropTypes } from 'react'

//Third-part
import {
  Input,
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
  InputNumber
} from 'antd'
import moment from 'moment'
import _ from 'lodash'
import classNames from 'classnames'
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item

//mine
import DragBallModel from '../DragBallModel'
import './LotteryPutModal.less'

const puttingPlatformOptions = [
  { label: 'web', value: 'web' },
  { label: 'ios', value: 'ios' },
  { label: 'android', value: 'android' },
]

const puttingActionOptions = [
  { label: '手动抽奖', value: '0' },
  { label: '定时抽奖', value: '1' },
]

export default class LotteryPutModal extends Component {
  constructor(props) {
    super(props)
    const { resourceData } = props
    this.state = {
      loadingState: false,
      puttingPlatform: puttingPlatformOptions.map(item => item.value),
      puttingAddressArray: [],
      action: puttingActionOptions[0].value,
      release: null,
      data: {
        dg: resourceData._id,
        screenType: 0,  // 0 水平 1 垂直
        action: 0,
        ios: false,
        web: false,
        android: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rooms: '',
        release: 0,
        lotteryTime: 15,
        vote: {
          instance: '',
          optionIdx: 0,
        }
      },
    }

  }

  static propTypes = {
    resourceData: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    anchorList: PropTypes.array.isRequired,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
  }

  /**
   * 获取内部拖拽，以用于提交解除绑定
   * @param drag
   * @param dragEle
   */
  getDrag = (drag, dragEle) => {
    this.Drag = drag
    this.dragEle = dragEle
  }

  /**
   * 提交投放
   * @returns {boolean}
   */
  confirm = () => {
    const { onOk } = this.props
    const { data, puttingPlatform, puttingAddressArray, action, release } = this.state

    if (!puttingPlatform.length) {
      message.error('必须要选择一个投放渠道')
      return false
    }
    if (!puttingAddressArray.length) {
      message.error('必须要选择一个抽奖房间')
      return false
    }

    if (action === '1') {
      if (!release) {
        message.error('必须要选择开奖时间')
        return false
      }
      if (!data.lotteryTime || data.lotteryTime < 0) {
        message.error('参与抽奖时间必须大于0秒')
        return false
      }
    }


    const sortedData = {
      ..._(puttingPlatform)
        .map(item => {
          return [item, true]
        })
        .fromPairs()
        .value(),
      rooms: puttingAddressArray.join(','),
      action: parseInt(action),
      release: release ? release.valueOf() : 0,
    }

    this.setState({
      loadingState: true
    }, () => {
      onOk({
        ...data,
        ...sortedData,
      })
    })
  }

  cancel() {
  }

  changePuttingPlatform = (value) => {
    this.setState({
      puttingPlatform: value
    })
  }

  changePuttingAddress = (array) => {
    this.setState({
      puttingAddressArray: array
    })
  }

  changePuttingAction = (value) => {
    this.setState({
      action: value
    })
  }

  changePuttingDate = (value) => {
    this.setState({
      release: value
    })
  }

  changeScreen = (e) => {
    const { data } = this.state
    data.screenType = e.target.value
    this.setState(
      { data },
      () => {
        this.dragEle.style.top = 0
        this.dragEle.style.left = 0
      })
  }

  setField = (parentKey, key, value) => {
    if (parentKey) {
      this.state[parentKey][key] = value
    } else {
      this.state[key] = value
    }
    this.setState({})
  }

  render() {
    const { onCancel, anchorList } = this.props
    const { data, rotate, loadingState, puttingPlatform, puttingAddressArray, action, release } = this.state
    const { confirm, cancel, getDrag, changePuttingPlatform, changePuttingAddress, changePuttingAction, changePuttingDate, changeScreen, setField } = this

    const prefixClassName = 'prize-put-modal'

    const footer = (
      <div>
        {
          /**
           * 按钮
           */
        }
        <Button
          type="primary"
          loading={loadingState}
          onClick={() => confirm()}
        >
          投放抽奖
        </Button>
      </div>
    )

    const dragBodyStyle = {
      overflow: 'hidden',
      width: '32px',
      height: '18px',
      left: 'auto',
      right: 0,
    }


    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    }

    const disabledDate = (current) => {
      return current && current.valueOf() < Date.now()
    }


    return (
      <div>
        <Modal
          title={'投放抽奖'}
          visible={true}
          onCancel={onCancel}
          wrapClassName={`${prefixClassName} ${data.screenType === 0 ? 'Horizontally' : 'vertically'}`}
          width={900}
          maskClosable={false}
          footer={footer}
        >
          <div>
            <p>广告定位</p>
            <span>
              <Radio.Group
                defaultValue={data.screenType}
                onChange={changeScreen}
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
              </Radio.Group>
            </span>

            {/*投票预览*/}
            <div
              className={`${prefixClassName}-content`}
            >
              <DragBallModel
                getDrag={getDrag}
                dragBodyStyle={dragBodyStyle}
                canResize={true}
                canDrag={true}
              >
                <div></div>
              </DragBallModel>
            </div>

            {/*投票配置*/}
            <div className={`${prefixClassName}-configure`}>
              <Row>
                <Col span={12}>
                  <FormItem
                    label="投放渠道"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                  >
                    <CheckboxGroup
                      options={puttingPlatformOptions}
                      value={puttingPlatform}
                      onChange={changePuttingPlatform}
                    />
                  </FormItem>

                </Col>
                {/*<Col span={12}>*/}
                {/*<FormItem>*/}
                {/*<Checkbox>只显示推送</Checkbox>*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
              </Row>
              <Row className={`${prefixClassName}-room`}>
                <p className={`${prefixClassName}-room-title`}>房间抽奖</p>
                <div className={`${prefixClassName}-room-container`}>
                  <FormItem
                    label="输入你要抽奖的房间"
                    {...formItemConfig}
                  >
                    <Select
                      value={puttingAddressArray}
                      multiple
                      style={{ width: '450px' }}
                      placeholder="请选择主播(主播房间)，可以多选"
                      onChange={changePuttingAddress}
                      notFoundContent="未找到主播房间"
                    >
                      {anchorList.map(item => {
                        return (
                          <Option
                            value={item.platformUserId}
                            key={item._id}
                          >
                            {`${item.username}(id:${item.platformUserId})`}
                          </Option>
                        )
                      })}
                    </Select>
                  </FormItem>
                </div>
              </Row>
              <Row>
                <FormItem
                  label="抽奖方式"
                  {...formItemConfig}
                >
                  <Select
                    style={{ width: '250px' }}
                    value={action}
                    onChange={changePuttingAction}
                  >
                    {
                      puttingActionOptions.map(item => {
                        return (
                          <Option key={item.value} value={item.value}>{item.label}</Option>
                        )
                      })
                    }
                  </Select>
                </FormItem>
              </Row>
              {
                action === '1' &&
                <div>
                  <Row>
                    <FormItem
                      label="开奖时间"
                      {...formItemConfig}
                    >
                      <DatePicker
                        value={release}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        onChange={changePuttingDate}
                      />
                    </FormItem>
                  </Row>
                  <Row>
                    <FormItem
                      label="参与抽奖时间"
                      {...formItemConfig}
                    >
                      <InputNumber
                        value={data.lotteryTime}
                        min={0}
                        onChange={value => setField('data', 'lotteryTime', value)}
                      />&nbsp;秒
                    </FormItem>

                  </Row>
                </div>
              }
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}