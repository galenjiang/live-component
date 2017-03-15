/**
 * Created by Galen on 2017/1/11.
 */
//official
import React, { Component, PropTypes } from 'react'

// third part
import _ from 'lodash'

import { Form, Input, InputNumber, Checkbox, Button, message } from 'antd'
const FormItem = Form.Item

// self
import TemplateModel from '../../TemplateModel'
import ImageUploader from '../../ImageUploader'
import MonitorUrl from '../../MonitorUrl'
import monitorUrlValidate from '../../MonitorUrl/monitorUrlValidate'

import validate from '../../../libs/utils/validate'
import config from './config'

// css
import './PraiseMissionModel.less'

export default class PraiseMissionModal extends Component {
  constructor(props) {
    super(props)

    const { isCreated, data } = props

    const config = {
      type: 'Praise',
      style: 0,
      title: '',
      multiple: 1,
      praiseSet: {
        praiseOption: [{
          pic: '',
          doBlame: false,
        }],
        monitorUrl: []
      }
    }

    this.state = {
      loading: false,
      data: _.defaults(data, config)
    }
  }

  static propsType = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isCreated: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
  }

  /**
   *
   * @param path
   * @param value
   * @private
   */
  setFields = (path, value) => {
    const { data } = this.state
    _.set(data, path, value)

    this.setState({
      data
    })
  }

  setMonitor = () => {

  }

  /**
   * @param index
   * @private
   */
  onSkinChange = (index) => {
    const { type } = this.props
    const { data } = this.state
    data.style = config[index].style
    this.setState({
      data
    })
  }

  onConfirm = async() => {
    const { onOk } = this.props
    const { data } = this.state


    let result = validate(data, _.find(config, item => item.style === data.style).validate)

    if (!result.res) {
      let stackList = result.stack
      message.error(`${_(stackList).map(item => item.key).compact().value().join(',')}${stackList[stackList.length - 1].error}`)
      return false
    }


    this.setState({
      loading: true
    }, async() => {
      try {
        await onOk(data)
      } catch ( e ) {
        this.setState({
          loading: false
        })
      }
    })
  }


  addList = () => {
    const { data } = this.state
    data.praiseSet.praiseOption.push({
      pic: '',
      doBlame: false,
    })
    this.setState({
      data
    })
  }

  removeList = index => {
    const { data } = this.state
    data.praiseSet.praiseOption.splice(index, 1)
    this.setState({
      data
    })
  }

  render() {
    const { onCancel, type, isCreated } = this.props
    const { loading, data } = this.state
    const { onConfirm, onSkinChange, setFields, addList, removeList, setMonitor } = this

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

    const prefix = 'mission-praise'

    return (
      <TemplateModel
        {...templateConfig}
      >
        <div>
          <FormItem
            label="点赞名称"
            {...formItemConfig}
          >
            <Input
              style={{ width: '250px' }}
              value={data.title}
              placeholder={'请输入点赞名称'}
              onChange={e => setFields('title', e.target.value)}
            />
          </FormItem>
          <FormItem
            label="点赞倍数"
            {...formItemConfig}
          >
            <InputNumber
              value={data.multiple}
              min={1}
              onChange={value => setFields('multiple', value)}
            />
          </FormItem>
          <fieldset className={`${prefix}-setting`}>
            {/*<legend>点赞设置</legend>*/}
            <h3 className={`${prefix}-setting-title`}>点赞设置</h3>
            {
              data.praiseSet.praiseOption.map((item, index) => {
                return (
                  <section
                    className={`${prefix}-setting-item`}
                    key={index}
                  >
                    <span>点赞项图示</span>
                    <div
                      className={`${prefix}-setting-img`}
                      style={{
                        width: '100px',
                        height: '100px',
                        //borderRadius: '50%',
                        //overflow: 'hidden'
                      }}
                    >
                      <ImageUploader
                        fileURL={item.pic}
                        onUploadChange={file => setFields(`praiseSet.praiseOption[${index}].pic`, file)}
                        {...{
                          crop: true,
                          disabled: false,
                          cropOptions: {
                            aspect: 1,
                          },
                        }}
                      />
                    </div>
                    <Checkbox
                      checked={item.doBlame}
                      onChange={e => setFields(`praiseSet.praiseOption[${index}].doBlame`, e.target.checked)}
                    >
                      该项可踩
                    </Checkbox>
                    <Button type="ghost" icon="delete" onClick={() => removeList(index)}/>
                  </section>
                )
              })
            }
            <div className={`${prefix}-add`}>
              <Button type="primary" icon="plus-square-o" onClick={addList}>添加点赞项</Button>
            </div>
          </fieldset>
        </div>
      </TemplateModel>
    )
  }
}
