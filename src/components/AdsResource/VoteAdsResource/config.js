import _ from 'lodash'
// import { commonHttpReg, commonHttpRegNotRequired } from '../../../libs/Reg'


const config = [
  {
    type: '基础样式',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/voteball/basic-skin.png',
    style: 0,
    validate: {
      title: {
        name: '投票标题',
        type: 'string',
        error: '必须填写',
        rules: [
          'required'
        ],
        placeholder: '请输入投票标题',
      },
      url: {
        name: '外链地址',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpRegNotRequired
        ],
        placeholder: '请输入外链地址',
      },
      titlePic: {
        name: '热点图片',
        type: 'string',
        error: '配置错误',
        rules: [
        ],
        cropConfig: {
          crop: true,
          disabled: true,
          cropOptions: {},
        },
      },
      votePic: {
        name: '投票图片',
        type: 'string',
        error: '配置错误',
        rules: [
        ],
        cropConfig: {
          crop: true,
          disabled: true,
          cropOptions: {}
        },
      },
      multiple: {
        name: '投票倍数',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      upPlace: {
        name: '向上位移值',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      voteRepeat: {
        name: '允许重复投票',
        type: 'boolean',
        error: '配置错误',
        rules: [],
      },
      qoptionsType: {
        name: '选项显示方式',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      qoptions: {
        name: '投票选项',
        type: 'array',
        items: [
          {
            name: '',
            type: 'object',
            properties: {
              title: {
                name: '选项标题',
                type: 'string',
                error: '必须填写，且不能大于15个字符',
                rules: [
                  'required',
                  /^.{0,15}$/,
                ],
                placeholder: '请输入选项标题',
              },
              pic: {
                name: '投票图片',
                type: 'string',
                error: '配置错误',
                rules: [
                ],
                cropConfig: {
                  crop: true,
                  disabled: true,
                  cropOptions: {}
                },
              },
            }
          }
        ]
      },
    }
  },
  {
    type: '扁平风',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/voteball/flat-skin.png',
    style: 1,
    validate: {
      title: {
        name: '投票标题',
        type: 'string',
        error: '必须填写',
        rules: [
          'required'
        ],
        placeholder: '请输入投票标题',
      },
      url: {
        name: '外链地址',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpRegNotRequired
        ],
        placeholder: '请输入外链地址',
      },
      titlePic: {
        name: '热点图片',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 7 / 4,
          }
        }
      },
      votePic: {
        name: '投票图片',
        type: 'string',
        error: '配置错误',
        rules: [
        ],
        cropConfig: {
          crop: true,
          disabled: true,
          cropOptions: {}
        },
      },
      multiple: {
        name: '投票倍数',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      upPlace: {
        name: '向上位移值',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      voteRepeat: {
        name: '允许重复投票',
        type: 'boolean',
        error: '配置错误',
        rules: [],
      },
      qoptionsType: {
        name: '选项显示方式',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      qoptions: {
        name: '投票选项',
        type: 'array',
        items: [
          {
            name: '',
            type: 'object',
            properties: {
              title: {
                name: '选项标题',
                type: 'string',
                error: '必须填写，且不能大于6个字符',
                rules: [
                  'required',
                  /^.{0,6}$/
                ],
                placeholder: '请输入选项标题',
              },
              pic: {
                name: '投票图片',
                type: 'string',
                error: '配置错误',
                rules: [
                  // commonHttpReg
                ],
                cropConfig: {
                  crop: true,
                  disabled: false,
                  cropOptions: {
                    aspect: 8 / 7,
                  }
                },
              },
            }
          }
        ]
      },
    }
  },
  {
    type: '科技风',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/voteball/tech-skin.png',
    style: 2,
    validate: {
      title: {
        name: '投票标题',
        type: 'string',
        error: '必须填写，切不能大于20个字符',
        rules: [
          'required',
          /^.{0,20}$/
        ],
        placeholder: '请输入投票标题',
      },
      url: {
        name: '外链地址',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpRegNotRequired
        ],
        placeholder: '请输入外链地址',
      },
      titlePic: {
        name: '热点图片',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 1,
          }
        }
      },
      votePic: {
        name: '投票图片',
        type: 'string',
        error: '配置错误',
        rules: [
        ],
        cropConfig: {
          crop: true,
          disabled: true,
          cropOptions: {}
        },
      },
      multiple: {
        name: '投票倍数',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      upPlace: {
        name: '向上位移值',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      voteRepeat: {
        name: '允许重复投票',
        type: 'boolean',
        error: '配置错误',
        rules: [],
      },
      qoptionsType: {
        name: '选项显示方式',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      qoptions: {
        name: '投票选项',
        type: 'array',
        items: [
          {
            name: '',
            type: 'object',
            properties: {
              title: {
                name: '选项标题',
                type: 'string',
                error: '必须填写，且不能大于10个字符',
                rules: [
                  'required',
                  /^.{0,10}$/
                ],
                placeholder: '请输入选项标题',
              },
              pic: {
                name: '投票图片',
                type: 'string',
                error: '配置错误',
                rules: [
                ],
                cropConfig: {
                  crop: true,
                  disabled: true,
                  cropOptions: {
                  }
                },
              },
            }
          }
        ]
      },
    }
  },
  {
    type: '芒果炫酷投票',
    skin: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/vote-previous-mango1-skin.png',
    style: 101,
    validate: {
      title: {
        name: '投票标题',
        type: 'string',
        error: '必须填写，且不能大于24个字符',
        rules: [
          'required',
          /^.{0,24}$/
        ],
        placeholder: '请输入投票标题',
      },
      url: {
        name: '外链地址',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg
        ],
        placeholder: '请输入外链地址',
      },
      titlePic: {
        name: '热点图片',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 300 / 100,
          }
        }
      },
      votePic: {
        name: '投票图片',
        type: 'string',
        error: '配置错误',
        rules: [
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 250 / 100,
          }
        },
      },
      multiple: {
        name: '投票倍数',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      upPlace: {
        name: '向上位移值',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      voteRepeat: {
        name: '允许重复投票',
        type: 'boolean',
        error: '配置错误',
        rules: [],
      },
      qoptionsType: {
        name: '选项显示方式',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      qoptions: {
        name: '投票选项',
        type: 'array',
        items: [
          {
            name: '',
            type: 'object',
            properties: {
              title: {
                name: '选项标题',
                type: 'string',
                error: '必须填写，不能大于6个字符',
                rules: [
                  'required',
                  /^.{0,6}$/
                ],
                placeholder: '请输入选项标题',
              },
              pic: {
                name: '投票图片',
                type: 'string',
                error: '配置错误',
                rules: [
                  // commonHttpReg
                ],
                cropConfig: {
                  crop: true,
                  disabled: false,
                  cropOptions: {
                    aspect: 14 / 15,
                  }
                },
              },
            }
          }
        ]
      },
    }
  },
  {
    type: '芒果经典投票',
    skin: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/vote-previous-mango2-skin.png',
    style: 102,
    validate: {
      title: {
        name: '投票标题',
        type: 'string',
        error: '必须填写，且不能大于24个字符',
        rules: [
          'required',
          /^.{0,24}$/
        ],
        placeholder: '请输入投票标题',
      },
      url: {
        name: '外链地址',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg
        ],
        placeholder: '请输入外链地址',
      },
      titlePic: {
        name: '热点图片',
        type: 'string',
        error: '配置错误',
        rules: [
          // commonHttpReg
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 480 / 160,
          }
        }
      },
      votePic: {
        name: '广告图片',
        type: 'string',
        error: '配置错误',
        rules: [
        ],
        cropConfig: {
          crop: true,
          disabled: false,
          cropOptions: {
            aspect: 600 / 240,
          }
        },
      },
      multiple: {
        name: '投票倍数',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      upPlace: {
        name: '向上位移值',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      voteRepeat: {
        name: '允许重复投票',
        type: 'boolean',
        error: '配置错误',
        rules: [],
      },
      qoptionsType: {
        name: '选项显示方式',
        type: 'number',
        error: '配置错误',
        rules: [],
      },
      qoptions: {
        name: '投票选项',
        type: 'array',
        items: [
          {
            name: '',
            type: 'object',
            properties: {
              title: {
                name: '选项标题',
                type: 'string',
                error: '必须填写，且不能大于8个字符',
                rules: [
                  'required',
                  /^.{0,8}$/
                ],
                placeholder: '请输入选项标题',
              },
              pic: {
                name: '投票图片',
                type: 'string',
                error: '配置错误',
                rules: [
                ],
                cropConfig: {
                  crop: true,
                  disabled: true,
                  cropOptions: {
                  }
                },
              },
            }
          }
        ]
      },
    }
  },
  {
    type: 'IWant基础风',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/voteball/basic-skin.png',
    style: 10200,
  },

  {
    type: 'IWant扁平风',
    skin: 'http://o6p1020jg.bkt.clouddn.com/static/voteball/flat-skin.png',
    style: 10201,
  },
];
export default config;
