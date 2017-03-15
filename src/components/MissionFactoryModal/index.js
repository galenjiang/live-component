/**
 * Created by Galen on 2016/12/20.
 */
//official
import React, { Component, PropTypes } from 'react'

// third part
import _ from 'lodash'
import { Form, Input, InputNumber, Select, message } from 'antd'

// self
import Praise from './PraiseMissionModel'
import Burst from './BurstMissionModel'

const MissionComponentMap = {
  Praise,
  Burst,
}

export default class MissionFactoryModal extends Component {
  constructor(props) {
    super(props)

  }

  static propsType = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isCreated: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
  }

  render() {
    const { isCreated, onOk, onCancel, data, type } = this.props

    const MissionModel = MissionComponentMap[type]

    if (MissionModel) {
      return (
        <MissionModel
          isCreated={isCreated}
          data={data}
          onCancel={onCancel}
          onOk={onOk}
          type={type}
        />
      )
    } else {
      console.warn('没有此类任务互动')
    }
    return null
  }
}