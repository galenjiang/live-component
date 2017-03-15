/**
 * Created by Galen on 2016/12/9.
 */
const config = [
  {
    type: '基础样式',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/picBall/basic-skin.png',
    style: 0,
    validate: {
      title: {
        name: '广告名称',
        type: 'string',
        error: '配置错误',
        rules: [
          'required'
        ]
      },
      desc: {
        name: '广告文案',
        type: 'string',
        error: '配置错误',
        rules: [
          'required'
        ]
      },
      pic: {
        name: '图片',
        type: 'string',
        error: '配置错误',
        rules: [
          'required'
        ]
      },
    }
  }
]
export default config
