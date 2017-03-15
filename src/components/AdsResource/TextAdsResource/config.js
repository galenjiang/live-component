// import { commonHttpReg, commonHttpRegNotRequired } from '../../../libs/Reg'


const config = [
  {
    type: '基础样式',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/textball/base-skin.png',
    style: 0,
    validate: {
      title: {
        name: '标题',
        type: 'string',
        rules: [],
      },
      textList: {
        name: '图文链内容',
        type: 'array',
        items: [
          {
            name: '',
            type: 'object',
            properties: {
              style: {
                name: '样式底色',
                type: 'number',
                error: '配置错误',
                rules: [],
              },
              content: {
                name: '描述内容',
                type: 'string',
                error: '不能为空，且不能大于15个字符',
                rules: [
                  'required',
                  /.{0,15}/,
                ],
              },
              icon: {
                name: 'icon小图',
                type: 'string',
                error: '配置错误',
                rules: [
                ],
              },
              linkOption: {
                name: '点击链接',
                type: 'number',
                error: '配置错误',
                rules: [],
              },

            },
          },
        ],
      },
    },
  },
  {
    type: '古典风',
    skin: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/text-previous-classic-style.png',
    style: 1,
    validate: {
      title: {
        name: '标题',
        type: 'string',
        rules: [],
      },
      textList: {
        name: '图文链内容',
        type: 'array',
        items: [
          {
            name: '',
            type: 'object',
            properties: {
              style: {
                name: '样式底色',
                type: 'number',
                error: '配置错误',
                rules: [],
              },
              content: {
                name: '描述内容',
                type: 'string',
                error: '不能为空，且不能大于15个字符',
                rules: [
                  'required',
                  /.{0,15}/,
                ],
              },
              icon: {
                name: 'icon小图',
                type: 'string',
                error: '配置错误',
                rules: [
                ],
              },
              linkOption: {
                name: '点击链接',
                type: 'number',
                error: '配置错误',
                rules: [],
              },
            },
          },
        ],
      },
    },
  },
  // {
  //   type: '简洁风',
  //   skin: 'http://o6p1020jg.bkt.clouddn.com/static/textball/flat-skin.png',
  //   style: 2,
  // },
];

export default config;
