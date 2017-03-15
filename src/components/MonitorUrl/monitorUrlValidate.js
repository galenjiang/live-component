/**
 * Created by Galen on 2016/11/29.
 */
import {message} from 'antd'
import _ from 'lodash'

import {httpRegWithOutProtocol, httpRegWithProtocol} from '../../libs/Reg'


const monitorUrlKeyMap = {
    view: '曝光监测',
    click: '点击监测'
  },
  monitorKeyMap = {
    web: 'PC端',
    ios: 'ios端',
    android: 'android端'
  }

export default function (data = [], text = '') {
  let temp = _.cloneDeep(data)
  for (let i = 0; i < temp.length; i++) {
    let monitorItem = _.omit(temp[i], ['admaster', 'key', '_id'])
    if(Object.keys(monitorItem).length === 0){
      message.error(`${text}监测代码配置错误,请输入至少一个监控端选项`)
      return false
    }

    // 处理每一项
    for (let key in monitorItem) {
      if (monitorItem.hasOwnProperty(key) && Object.keys(monitorKeyMap).indexOf(key) >= 0) {
        if (!monitorItem[key]) {
          message.error(`${text}监测代码配置错误,请输入第${i + 1}个监控选项中的${monitorKeyMap[key]}`)
          return false
        }

        for (let keyMap in monitorUrlKeyMap) {
          if (!httpRegWithOutProtocol.test(monitorItem[key][keyMap]) && !httpRegWithProtocol.test(monitorItem[key][keyMap])) {
            message.error(`${text}监测代码配置错误,请正确输入第${i + 1}个监控选项中的${monitorKeyMap[key]}${monitorUrlKeyMap[keyMap]}`)
            return false
          }
        }

      }
    }
  }
  return true
}
