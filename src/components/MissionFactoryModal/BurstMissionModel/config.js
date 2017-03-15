/**
 * Created by Galen on 2016/12/20.
 */

import { commonHttpReg } from '../../../libs/Reg'

const config = [
  {
    style: 0,
    styleName: '点赞',
    skin: '',
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
    }
  }
]

export default config