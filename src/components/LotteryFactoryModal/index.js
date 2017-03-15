/**
 * Created by Galen on 2016/12/20.
 */
//official
import React, { Component, PropTypes } from 'react'

// third part
import _ from 'lodash'
import { Form, Input, InputNumber, Select, message } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

// self
import TemplateModal from '../TemplateModel'
import config from './config'
import ImageGroup from '../ImageGroup'
import validate from '../../libs/utils/validate'
import { constantsLotteryMap } from '../../constants'

export default class LotteryFactoryModal extends Component {
  constructor(props) {
    super(props)
    const { data, isCreated } = props
    const modelConfig = {
      style: 0,
      type: Object.keys(constantsLotteryMap)[0],
      title: '',
      description: '',
      prize: [''],
      amount: 1,
    }

    if (isCreated) {
      this.state = {
        loading: false,
        data: {
          ...modelConfig
        }
      }
    } else {
      this.state = {
        loading: false,
        data: {
          ...modelConfig,
          ...data
        }
      }
    }
  }

  static propsType = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isCreated: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
  }

  onConfirm = () => {
    const data = _.cloneDeep(this.state.data)
    let result = validate(data, _.find(config, item => item.style === data.style).validate)


    if (!result.res) {
      let stackList = result.stack
      message.error(`${_(stackList).map(item => item.key).compact().value().join(',')}${stackList[stackList.length - 1].error}`)
      return false
    }

    //开始上传数据
    let { onOk } = this.props

    this.setState({
      loading: true
    }, async() => {
      try {
        await onOk({
          ...data
        })
      } catch ( e ) {
        this.setState({
          loading: false
        })
      }
    })
  }

  /**
   * skin change
   * @param index
   */
  onSkinChange = (index) => {
    const { data } = this.state
    data.style = config[index].style
    this.setState({
      data
    })
  }

  __setFields = (key, value, index) => {
    const { data } = this.state
    // if (key === 'prize') {
    //   data[key][index] = value
    // } else {
    data[key] = value
    // }
    this.setState({
      data
    })
  }

  render() {
    const { isCreated, onCancel } = this.props
    const { loading, data } = this.state
    const { onSkinChange, onConfirm, __setFields } = this

    const lotteryConfig = _.find(config, item => item.style === data.style).validate

    const templateConfig = {
      isCreated,
      title: _.find(config, item => item.style === data.style).styleName,
      skinTypeList: config,
      skin: _.findIndex(config, item => item.style === data.style),
      onSkinChange,
      onCancel,
      onConfirm,
      loading,
    }

    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true
    }

    const noRequiredFormItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }

    return (
      <TemplateModal
        {...templateConfig}
      >
        <div>
          <FormItem
            label="抽奖标题"
            {...formItemConfig}
          >
            <Input
              style={{ width: '250px' }}
              value={data.title}
              placeholder={lotteryConfig.title.placeholder}
              onChange={e => __setFields('title', e.target.value)}
            />
          </FormItem>
          <FormItem
            label="抽奖描述"
            {...formItemConfig}
          >
            <Input
              style={{ width: '450px' }}
              type="textarea"
              rows={3}
              value={data.description}
              onChange={e => __setFields('description', e.target.value)}
            />
          </FormItem>
          <FormItem
            label="抽奖图片"
            {...formItemConfig}
          >
            <ImageGroup
              images={data.prize}
              onChange={value => {
                __setFields('prize', value)
              }}
              cropConfig={{
                crop: true,
                disabled: false,
                cropOptions: {
                  aspect: 1,
                },
              }}
              imageStyle={{
                width: '200px',
                height: '200px',
              }}
              minLength={1}
            />

          </FormItem>
          <FormItem
            label="抽奖人数"
            {...formItemConfig}
          >
            <InputNumber
              value={data.amount}
              min={0}
              onChange={value => __setFields('amount', value)}
            />
          </FormItem>
          <FormItem
            label="抽奖方式"
            {...formItemConfig}
          >
            <Select
              style={{ width: '250px' }}
              value={data.type}
              onChange={value => __setFields('type', value)}
            >
              {

                _(constantsLotteryMap)
                  .map((item, key) => {
                    return (
                      <Option key={key} value={key}>{item.value}</Option>
                    )
                  })
                  .value()
              }
            </Select>
          </FormItem>
        </div>
      </TemplateModal>
    )
  }
}