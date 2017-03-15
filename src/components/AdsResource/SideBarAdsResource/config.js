/**
 * Created by Galen on 2016/12/7.
 */
// import { commonHttpReg } from '../../../libs/Reg'

const config = [
  {
    style: 0,
    type: '基础样式',
    skin: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/sidebar-previous-basic-skin.png',
    validate: {
      title: {
        name: '侧边栏名称',
        type: 'string',
        error: '配置错误',
        rules: [
          'required',
        ],
        placeholder: '请输入侧边栏名称',
      },
      icon: {
        name: 'ICON',
        type: 'string',
        error: '配置错误',
        rules: [
          'required',
          // commonHttpReg
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 1,
          },
        },
      },
      cover: {
        name: '图片',
        type: 'array',
        error: '配置错误',
        items: [{
          name: '',
          type: 'object',
          error: '配置错误',
          properties: {
            fileType: {
              name: '图片类型',
              type: 'string',
              error: '配置错误',
              rules: []
            },
            src: {
              name: '图片路径',
              type: 'string',
              error: '配置错误',
              rules: [
                // commonHttpReg
              ]
            }
          }
        }]
      },
      coverLink: {
        name: '图片外链',
        type: 'string',
        placeholder: '点击图片跳转的地址',
        error: '配置错误',
        rules: [
          // commonHttpReg,
        ],
      },
      themeColor: {
        name: '主题色',
        type: 'number',
        error: '配置错误',
        rules: [],
        placeholder: '',
      },
      textTitle: {
        name: '标题文字',
        type: 'string',
        error: '不能为空, 且不能输入多于10个字符',
        rules: [
          'required',
          /^.{0,10}$/,
        ],
        placeholder: '请输入标题文字，要求小于或等于10个字符',

      },
      textDescription: {
        name: '说明文字',
        type: 'string',
        error: '不能为空, 且不能输入多于24个字符',
        rules: [
          'required',
          /^.{0,24}$/,
        ],
        placeholder: '请输入说明文字，要求小于或等于24个字符',

      },
      btn: {
        name: '按钮',
        type: 'object',
        properties: {
          content: {
            name: '按钮文字',
            type: 'string',
            error: '不能为空, 且不能输入多于4个字符',
            rules: [
              'required',
              /^.{0,4}$/,
            ],
            placeholder: '请输入按钮文字，要求小于或等于4个字符',
          },
          link: {
            name: '按钮外链',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg,
            ],
            placeholder: '请输入点击按钮跳转的地址',
          }
        }
      },
      needPraised: {
        name: '是否需要点赞功能',
        type: 'boolean',
        error: '配置错误',
        rules: [],
      }
    }
  },
  {
    style: 1,
    type: '轮播样式',
    skin: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/sidebar-previous-basic-skin.png',
    validate: {
      title: {
        name: '侧边栏名称',
        type: 'string',
        error: '配置错误',
        rules: [
          'required',
        ],
        placeholder: '请输入侧边栏名称',
      },
      icon: {
        name: 'ICON',
        type: 'string',
        error: '配置错误',
        rules: [
          'required',
          // commonHttpReg
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 1,
          },
        },
      },
      cover: {
        name: '图片',
        type: 'array',
        error: '配置错误',
        items: [{
          name: '',
          type: 'object',
          error: '配置错误',
          properties: {
            fileType: {
              name: '图片类型',
              type: 'string',
              error: '配置错误',
              rules: []
            },
            src: {
              name: '图片路径',
              type: 'string',
              error: '配置错误',
              rules: [
                // commonHttpReg
              ]
            }
          }
        }]
      },
      coverLink: {
        name: '图片外链',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg,
        ],
        placeholder: '点击图片跳转的地址',
      },
      themeColor: {
        name: '主题色',
        type: 'number',
        error: '配置错误',
        rules: [],
        placeholder: '',
      },
      textTitle: {
        name: '标题文字',
        type: 'string',
        error: '不能为空, 且不能输入多于10个字符',
        rules: [
          'required',
          /^.{0,10}$/
        ],
        placeholder: '请输入标题文字，要求小于或等于10个字符',

      },
      textDescription: {
        name: '说明文字',
        type: 'string',
        error: '不能为空, 且不能输入多于24个字符',
        rules: [
          'required',
          /^.{0,24}$/
        ],
        placeholder: '请输入说明文字，要求小于或等于24个字符',

      },
      btn: {
        name: '按钮',
        type: 'object',
        properties: {
          content: {
            name: '按钮文字',
            type: 'string',
            error: '不能为空, 且不能输入多于4个字符',
            rules: [
              'required',
              /^.{0,4}$/
            ],
            placeholder: '请输入按钮文字，要求小于或等于4个字符',
          },
          link: {
            name: '按钮外链',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg,
            ],
            placeholder: '请输入点击按钮跳转的地址',
          }
        }
      },
      needPraised: {
        name: '是否需要点赞功能',
        type: 'boolean',
        error: '配置错误',
        rules: [],
      }
    }
  },
]


export default config;
