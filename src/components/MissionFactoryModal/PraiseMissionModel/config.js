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
        name: '标题',
        type: 'string',
        error: '不能为空',
        rules: [
          'required',
        ],
        placeholder: '请输入标题',
      },
      multiple: {
        name: '倍数',
        type: 'number',
        error: '不能为空',
        rules: [
          'required',
        ],
        placeholder: '请输入倍数',
      },
      praiseSet: {
        name: '',
        type: 'object',
        properties: {
          praiseOption: {
            name: '点赞设置',
            type: 'array',
            items: [{
              name: '',
              type: 'object',
              properties: {
                pic: {
                  name: '点赞项图示',
                  type: 'string',
                  error: '不能为空',
                  rules: [
                    commonHttpReg,
                  ],
                },
                doBlame: {
                  name: '可踩选项',
                  type: 'boolean',
                  error: '不能为空',
                  rules: [
                  ],
                },
              }
            }]
          }
        }
      },
    }
  }
]

export default config