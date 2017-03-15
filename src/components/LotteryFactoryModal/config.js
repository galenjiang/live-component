/**
 * Created by Galen on 2016/12/20.
 */

import { commonHttpReg } from '../../libs/Reg'

const config = [
  {
    style: 0,
    styleName: '双色球',
    skin: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/lottery-basic-skin.png',
    validate: {
      title: {
        name: '抽奖标题',
        type: 'string',
        error: '不能为空, 不能大于7个字符',
        rules: [
          'required',
          /^.{0,7}$/
        ],
        placeholder: '请输入抽奖标题',
      },
      description: {
        name: '抽奖描述',
        type: 'string',
        error: '不能为空',
        rules: [
          'required'
        ],
        placeholder: '请输入抽奖描述，详细说明抽奖的规则',
      },
      prize: {
        name: '抽奖图片',
        type: 'array',
        error: '配置错误',
        items: [{
          name: '',
          type: 'string',
          error: '配置错误',
          rules: [
            commonHttpReg
          ]
        }]
      },
      amount: {
        name: '抽奖数量',
        type: 'number',
        error: '不能为空',
        rules: [
          'required'
        ],
      },

      type: {
        name: '抽奖类型',
        type: 'string',
        error: '不能为空',
        rules: [
          'required'
        ],
      },
    }
  }
]

export default config