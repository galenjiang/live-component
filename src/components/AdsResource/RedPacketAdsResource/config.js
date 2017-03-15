// import { commonHttpReg, commonHttpRegNotRequired } from '../../../libs/Reg'
// import { multiLineStringLimit } from '../../../libs/utils/util'
// import _ from 'lodash'

const config = [
  {
    style: 0,
    type: '普通红包',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/redpacket/basic-skin.png',
    validate: {
      title: {
        name: '标题',
        type: 'string',
        rules: [
          /^.{0,10}$/
        ],
        placeholder: '红包广告标题',
      },
      pic: {
        name: '热点图片',
        type: 'string',
        error: '',
        rules: [
          // commonHttpReg
        ],
      },
      webUrl: {
        name: '',
        type: '',
        rules: [
          // commonHttpReg
        ],
      },
      mobileUrl: {
        name: '',
        type: '',
        rules: [
          // commonHttpReg
        ],
      },
      displayCountDown: {
        name: '',
        type: 'boolean',
        rules: [],
      },
      countDownText: {
        name: '',
        type: '',
        rules: [],
      },
      qrCodePage: {
        name: '',
        type: 'object',
        properties: {
          slogan: {
            name: '',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
          },
          background: {
            name: '',
            type: 'string',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: true,
              cropOptions: {
                aspect: 3 / 5,
              },
            },
          },
          minIcon: {
            name: '',
            type: 'string',
            error: '',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: true,
              cropOptions: {
                aspect: 8 / 9,
              },
            },
          },
          narrowBtnColor: {
            name: '',
            type: 'string',
            error: '配置错误',
            rules: [],
          },
          descriptionImg: {
            name: '',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
          },
          descriptionText: {
            name: '',
            type: 'array',
            rules: []
          }

        },
      },
      afterOpen: {
        name: '',
        type: 'object',
        properties: {
          slogan: {
            name: '',
            type: 'string',
            rules: [],
          },
          background: {
            name: '',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: true,
              cropOptions: {
                aspect: 3 / 5,
              },
            },
            pic: {
              name: '',
              type: 'string',
              rules: [
                // commonHttpReg
              ],
              cropConfig: {
                crop: true,
                disabled: true,
                cropOptions: {
                  aspect: 6 / 4,
                },
              },
            },
          },
          link: {
            name: '',
            type: '',
            rules: [
              // commonHttpReg
            ],
          },
          btnLabel: {
            name: '',
            type: '',
            rules: [],
          }
        },
      }
    }

  },
  {
    style: 1,
    type: '芒果口令红包',
    skin: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/redpacket-previous-password-skin.png',
    validate: {
      title: {
        name: '标题',
        type: 'string',
        error: '不能为空',
        rules: [
          'required',
        ],
        placeholder: '红包广告标题',
      },
      pic: {
        name: '热点图片',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg
        ]
      },
      displayCountDown: {
        name: '是否显示提示标语',
        type: 'boolean',
        error: '配置错误',
        rules: []
      },
      countDownText: {
        name: '提示标语文本',
        type: 'string',
        error: '且最多8个字符',
        rules: [
          // multiLineStringLimit(8)
        ],
        placeholder: '提示标语文本 共8个字符 一行4个字符',
      },
      passwordPage: {
        name: '',
        type: 'object',
        properties: {
          slogan: {
            name: '红包标题',
            type: 'string',
            error: '不能为空，且最多8个字符',
            rules: [
              'required',
              /^.{0,8}$/
            ],
            placeholder: '红包标语 共8个字符',
          },
          background: {
            name: '红包背景图片',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: false,
              cropOptions: {
                aspect: 210 / 370,
              },
            },
          },
          miniLogo: {
            name: '品牌LOGO小图',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: false,
              cropOptions: {
                aspect: 120 / 120,
              },
            },
          },
          password: {
            name: '红包口令',
            type: 'string',
            error: '最多20个字符',
            rules: [
              'required',
              // multiLineStringLimit(20)
            ],
            placeholder: '红包口令共两行 最多20个字符',
          },
          btnText: {
            name: '按钮文字',
            type: 'string',
            error: '最多8个字符',
            rules: [
              'required',
              /^.{0,8}$/
            ],
            placeholder: '按钮文字 最多8个字符',
          },
          exchangeText: {
            name: '兑换说明',
            type: 'string',
            error: '最多20个字符',
            rules: [
              // multiLineStringLimit(20)
            ],
            placeholder: '兑换说明共两行，最多20个字符',
          },
          bannerPic: {
            name: '广告banner图片',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: false,
              cropOptions: {
                aspect: 500 / 150,
              },
            },
          },
          bannerLink: {
            name: '广告banner外链',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpRegNotRequired
            ],
            placeholder: '请输入广告banner外链',
          },
        }
      }
    }
  },
  {
    style: 2,
    type: '芒果优惠码红包',
    skin: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/redpacket-previous-promo-skin.png',
    validate: {
      title: {
        name: '标题',
        type: 'string',
        error: '不能为空',
        rules: [
          'required',
        ],
        placeholder: '红包广告标题',
      },
      pic: {
        name: '热点图片',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg
        ],
      },
      displayCountDown: {
        name: '是否显示提示标语',
        type: 'boolean',
        error: '',
        rules: [],
      },
      countDownText: {
        name: '提示标语文本',
        type: 'string',
        error: '最多8个字符',
        rules: [
          // multiLineStringLimit(8)
        ],
        placeholder: '提示标语文本 共8个字符 一行4个',
      },
      promoCodePage: {
        name: '',
        type: 'object',
        properties: {
          slogan: {
            name: '红包顶部标题',
            type: 'string',
            error: '最多8个字符',
            rules: [
              'required',
              /^.{0,8}$/
            ],
            placeholder: '红包顶部标题 共8个字符',
          },
          background: {
            name: '红包背景图片',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: false,
              cropOptions: {
                aspect: 210 / 370,
              },
            },
          },
          miniLogo: {
            name: '品牌LOGO小图',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: false,
              cropOptions: {
                aspect: 120 / 120,
              },
            },
          },
          content: {
            name: '红包标题',
            type: 'string',
            error: '不能为空，不能输入多于12个字符',
            rules: [
              'required',
              /^.{0,12}$/
            ],
            placeholder: '请输入红包标题 最多12个字符',
          },
          amount: {
            name: '红包内容',
            type: 'string',
            error: '不能为空，最多为8个字符',
            rules: [
              'required',
              /^.{0,8}$/
            ],
            placeholder: '请输入红包内容， 最多为8个字符',
          },
          completeText: {
            name: '领完优惠码提示',
            type: 'string',
            error: '不能为空，不能输入多于20个字符',
            rules: [
              'required',
              // multiLineStringLimit(20)
            ],
            placeholder: '优惠码领完提示可两行 最多20个字符',
          },
          receiveFinishText: {
            name: '结束提示',
            type: 'string',
            error: '不能输入多于20个字符',
            rules: [
              // multiLineStringLimit(20)
            ],
            placeholder: '结束提示文字提示可两行 最多20个字符',
          },
          btnText: {
            name: '按钮文字',
            type: 'string',
            error: '最多8个字符',
            rules: [
              'required',
              /^.{0,8}$/
            ],
            placeholder: '按钮文字 最多8个字符',
          },
          exchangeText: {
            name: '兑换说明',
            type: 'string',
            error: '最多20个字符',
            rules: [
              // multiLineStringLimit(20)
            ],
            placeholder: '兑换说明可两行 最多20个字符',
          },
          bannerPic: {
            name: '广告banner图片',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: false,
              cropOptions: {
                aspect: 500 / 150,
              },
            },
          },
          bannerLink: {
            name: '广告banner外链',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpRegNotRequired
            ],
            placeholder: '请输入广告banner外链',
          },
        }
      }
    },
  },
  {
    style: 3,
    type: '芒果二维码红包',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/redpacket/basic-skin.png',
    validate: {
      title: {
        name: '广告标题',
        type: 'string',
        error: '必须要填写',
        rules: [
          'required',
        ],
        placeholder: '请输入红包广告标题',
      },
      pic: {
        name: '热点图片',
        type: 'string',
        error: '红包热点图片必须填写',
        rules: [
          // commonHttpReg
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 90 / 120,
          },
        },
      },
      displayCountDown: {
        name: '是否显示标语',
        type: 'boolean',
        rules: [],
      },
      countDownText: {
        name: '热点标语',
        type: 'string',
        error: '不能大于8个字符',
        rules: [
          // multiLineStringLimit(8),
        ],
      },
      webUrl: {
        name: '红包链接',
        type: 'string',
        error: '地址填写不正确',
        rules: [
          // commonHttpReg
        ],
      },
      qrCodePage: {
        name: '',
        type: 'object',
        properties: {
          slogan: {
            name: '红包标题',
            type: 'string',
            error: '不能大于12个字符',
            rules: [
              'required',
              // multiLineStringLimit(12),
            ],
            placeholder: '请输入红包标题',
          },
          minIcon: {
            name: '品牌LOGO',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: false,
              cropOptions: {
                aspect: 80 / 80,
              },
            },
          },
          descriptionText: {
            name: '领取介绍',
            type: 'array',
            error: '必须要填写，且不能超过20个字符',
            items: [],
            rules: [
            ],
            placeholder: '请输入红包广告领取介绍',
          }

        },
      },
      afterOpen: {
        name: '',
        type: 'object',
        properties: {
          pic: {
            name: '广告图片',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpReg
            ],
            cropConfig: {
              crop: true,
              disabled: false,
              cropOptions: {
                aspect: 150 / 150,
              },
            },
          },
          link: {
            name: '广告链接',
            type: 'string',
            error: '配置错误',
            rules: [
              // commonHttpRegNotRequired
            ],
          },
        },
      }
    }

  },
];

export default config;
