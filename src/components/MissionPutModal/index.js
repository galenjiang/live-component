'use strict'
//official
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//Third-part
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
  message,
  InputNumber,
  Input,
  Tooltip,
  Icon
} from 'antd'
import moment from 'moment'
import _ from 'lodash'
import classNames from 'classnames'
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const RadioGroup = Radio.Group

//mine
import * as actions from '../../action/action.anchor'
import DragContainer from '../DragContainer'
import './MissionPutModal.less'

const putinPlatformOptions = [
  { label: 'web', value: 'web' },
  { label: 'ios', value: 'ios' },
  { label: 'android', value: 'android' },
]

const putinActionOptions = [
  { label: '即时投放', value: '0' },
  { label: '定时投放', value: '1' },
  { label: '手动投放', value: '2' },
]


const mapStateToProps = state => {
  return state.anchor.toJS()
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Object.assign({}, actions), dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MissionPutModal extends Component {
  constructor(props) {
    super(props)
    const { resourceData } = props
    this.state = {
      loading: false,
      data: {
        screenType: 0,  // 0 水平 1 垂直
        action: putinActionOptions[0].value,
        platform: putinPlatformOptions.map(item => item.value),
        roomType: 1,   // 选择房间类型 全部0， 分别选
        ex: 0,         // 热点
        specifyPutTime: null,
        rooms: '',
        closeBtnAppear: 0,      // -1 不显示关闭
        canClose: true,
        closeTime: 0,
      },
    }
    this.dragList = []
    this.dragElList = []
  }

  static propTypes = {
    resourceData: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    anchorList: PropTypes.array.isRequired,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
  }

  componentDidMount() {
    const { actions } = this.props
    actions.getAllLiveUserList()
  }

  /**
   * 获取内部拖拽，以用于提交解除绑定
   * @param drag
   * @param dragElList
   */
  getDrag = (drag, dragElList) => {
    this.dragList.push(drag)
    this.dragElList.push(dragElList)
  }

  /**
   * 提交投放
   * @returns {boolean}
   */
  confirm = () => {
    const { onOk, resourceData } = this.props
    const data = _.cloneDeep(this.state.data)
    if (data.action === '1' && !data.specifyPutTime) {
      message.error('请输入特定投放时间')
      return false
    }
    if (data.roomType === 1 && data.rooms.length === 0) {
      message.error('请输入特定投放房间')
      return false
    }

    let sortedData = {
      dg: resourceData._id,
      action: parseInt(data.action),
      rooms: data.roomType === 0 ? '@all' : data.rooms.join(','),
      type: resourceData.type,
      ex: data.ex,
      closeBtnAppear: data.canClose ? data.closeTime : -1,
      pushOnly: data.pushOnly,
      screenType: data.screenType,
      specifyPutTime: data.action === '0' ? null : (data.specifyPutTime ? data.specifyPutTime.valueOf() : null),
      ...{
        ios: false,
        web: false,
        android: false,
      },
      ..._(data.platform)
        .map(item => {
          return [item, true]
        })
        .fromPairs()
        .value(),
      ..._(this.dragList[0].calculatePos()).mapKeys((value, key) => `pic${_.capitalize(key)}`).value()
    }
    
    sortedData = _.omitBy(sortedData, _.isNil)

    this.setState({
      loading: true
    }, async() => {
      try {
        await onOk(sortedData)
        this.setState({
          loading: false
        })
      } catch ( e ) {
        this.setState({
          loading: false
        })
      }
    })
  }

  cancel() {
  }

  changeScreen = value => {
    const { data } = this.state
    data.screenType = value
    this.setState(
      { data },
      () => {
        this.dragElList.map((el, index) => {
          el.style.top = 0
          el.style.left = 0
        })
      })
  }

  setField = (path, value) => {
    const { data } = this.state
    _.set(data, path, value)
    this.setState({
      data
    })
  }

  render() {
    const { onCancel, liveAllUserList, visible } = this.props
    const { data, loading } = this.state
    const { confirm, getDrag, changeScreen, setField } = this

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
          loading={loading}
          onClick={() => confirm()}
        >
          投放任务
        </Button>
      </div>
    )

    const dragBodyStyle = {
      overflow: 'hidden',
      width: '32px',
      height: '18px',
      // left: 'auto',
      // right: 0,
    }
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px'
    }


    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    }

    const notRequiredFormItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }

    const disabledDate = (current) => {
      return current && current.valueOf() < Date.now()
    }


    const dragConfig = [
      {
        dragBodyStyle: dragBodyStyle,
        canResize: true,
        canDrag: true,
      }
    ]

    return (
      <div>
        <Modal
          title={'投放任务'}
          visible={visible}
          onCancel={onCancel}
          wrapClassName={`${prefixClassName} ${data.screenType === 0 ? 'Horizontally' : 'vertically'}`}
          width={900}
          maskClosable={false}
          footer={footer}
        >
          <div>
            <p>任务定位</p>
            <span>
              <Radio.Group
                value={data.screenType}
                onChange={e => changeScreen(e.target.value)}
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
              <DragContainer
                getDrag={getDrag}
                dragConfig={dragConfig}
                dragBodyStyle={dragBodyStyle}
                canResize={true}
                canDrag={true}
              >
                <div></div>
              </DragContainer>
            </div>

            {/*投票配置*/}
            <section className={`${prefixClassName}-configure`}>
              <FormItem
                label="投放渠道"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <CheckboxGroup
                  options={putinPlatformOptions}
                  value={data.platform}
                  onChange={value => setField('platform', value)}
                />
              </FormItem>
              <Row>
                {/*左栏*/}
                <Col span={12}>

                  <FormItem
                    label="投放方式"
                    {
                      ...formItemConfig
                    }
                  >
                    <Select
                      style={{ width: '250px' }}
                      value={data.action}
                      onChange={value => setField('action', value)}
                    >
                      {
                        putinActionOptions.map((item, index) => {
                          return (
                            <Option key={index} value={item.value}>{item.label}</Option>
                          )
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem
                    label="投放地址"
                    {
                      ...formItemConfig
                    }
                  >
                    <RadioGroup
                      value={data.roomType}
                      onChange={e => setField('roomType', e.target.value)}
                    >
                      <Radio style={radioStyle} value={0}>通投全平台</Radio>
                      <Radio style={radioStyle} value={1}>投放特定房间</Radio>
                    </RadioGroup>
                    <Select
                      multiple
                      style={{ width: '100%', paddingRight: '5em' }}
                      placeholder="选择投放房间，可以多选"
                      onChange={value => setField('rooms', value)}
                      disabled={data.roomType === 0}
                    >
                      {
                        liveAllUserList.map((item, index) => {
                          return (
                            <Option key={index} value={item.platformUserId}>
                              {`${item.username}(id:${item.platformUserId})`}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Checkbox
                      style={{ marginLeft: '2em' }}
                      onChange={e => setField('pushOnly', e.target.checked)}
                    >
                      只显示推送
                    </Checkbox>
                    <Tooltip
                      title="勾选代表切换直播间也不会显示，不勾选在显示时间内切换直播间也能看到"
                    >
                      <Icon type="question-circle"/>
                    </Tooltip>
                  </FormItem>

                </Col>
                {/*右栏*/}
                <Col span={12}>
                  <FormItem
                    label="特定时间投放"
                    {...notRequiredFormItemConfig}
                  >
                    <DatePicker
                      disabled={data.action === '0'}
                      value={data.specifyPutTime}
                      format="YYYY-MM-DD HH:mm:ss"
                      onChange={value => setField('specifyPutTime', value)}
                      showTime
                    />
                  </FormItem>
                  {/*<FormItem>*/}
                    {/*<Checkbox*/}
                      {/*checked={data.canClose}*/}
                      {/*onChange={e => setField('canClose', e.target.checked)}*/}
                    {/*>*/}
                      {/*可关闭*/}
                    {/*</Checkbox>*/}
                    {/*<InputNumber*/}
                      {/*min={0}*/}
                      {/*value={data.closeTime}*/}
                      {/*disabled={!data.canClose}*/}
                      {/*onChange={value => setField('closeTime', value)}*/}
                    {/*/>&nbsp;秒出现关闭按钮*/}
                  {/*</FormItem>*/}
                  {/*<FormItem*/}
                    {/*label="互动显示时长"*/}
                    {/*{...formItemConfig}*/}
                  {/*>*/}
                    {/*<InputNumber*/}
                      {/*min={0}*/}
                      {/*value={data.ex}*/}
                      {/*onChange={value => setField('ex', value)}*/}
                    {/*/>&nbsp;秒&nbsp;*/}

                    {/*<Tooltip*/}
                      {/*title="默认为0，代表一直显示。填入具体数值后只显示固定秒数"*/}
                    {/*>*/}
                      {/*<Icon type="question-circle"/>*/}
                    {/*</Tooltip>*/}
                  {/*</FormItem>*/}
                </Col>
              </Row>

            </section>
          </div>
        </Modal>
      </div>
    )
  }
}