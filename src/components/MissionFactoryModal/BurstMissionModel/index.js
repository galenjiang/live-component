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
import './BurstMissionModel.less'

export default class BurstMissionModal extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return null
  }
}