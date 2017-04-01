
// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// Third-part
import { message } from 'antd';
import _ from 'lodash';

// self components
import Basic from './RedPacketForm/Basic';
import MangoPassword from './RedPacketForm/MangoPassword';
import MangoPromoCode from './RedPacketForm/MangoPromoCode';
import MangoBarCode from './RedPacketForm/MangoBarCode';
import ResourceModal from '../../ResourceModal';
import utils from '../../../utils';
import config from './config';

// style
import style from './style.M.less';

const { event, decorators: { formCreate } } = utils;

@CSSModule(style)
export default class ModalAdRedPackets extends Component {
  static propTypes = {
    styleConfig: PropTypes.object,
  }

  static defaultProps = {
    styleConfig: {
      HongBaoAds: {
        style: config.map(item => item.style),
      },
    },
  }


  static propsType = {
    data: PropTypes.object.isRequired,
    isCreated: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    const { data } = props;
    const modelConfig = {
      __t: 'HongBaoAds',
      style: 0,
      title: '', // 红包标题
      pic: 'http://static.cdn.videojj.com/FpMdcAlO2-fbx4mm09ZV2L34CO_6', // 普通红包图片
      displayCountDown: false,
      webUrl: '',      // web端落地配置
      mobileUrl: '',    // 移动端落地配置
      countDownText: '',  // 倒计时文本
      qrCodePage: {},  // 普通红包，二维码页  以后进行重构
      afterOpen: {},    // 普通红包，扫二维码后 以后进行重构
      passwordPage: {},  // 口令红包
      promoCodePage: {}, // 优惠码红包
      monitorUrl: [],
    };


    this.state = {
      loading: false,
      data: _.defaults(data, modelConfig),
    };

    // if (isCreateBall) {
    //   this.state = {
    //     loading: false,
    //     data: {
    //       ...modelConfig,
    //       ...{
    //         qrCodePage: qrCodePageConfig,
    //       }
    //     },
    //     descOption: true,
    //   }
    // } else {
    //   // 之前没有style,后来增加类型，原来没有data没有style会出现判断失误
    //   if (!data.style) {
    //     data.style = 0
    //   }

    //   this.state = {
    //     loading: false,
    //     data: {
    //       ...modelConfig,
    //       ...data
    //     },
    //     isColorPickerShow: false,
    //   }
    // }
  }


  /**
   * 点击确定的提交表单
   * @private
   */
  onOk = () => {
    const { onOk } = this.props;
    event.$emit('validateFields', (values, monitorUrl, promo) => {
      const sortedData = _(values)
        .mapValues((item, key) => {
          // if (key === 'cover') {
          //   return _(item).map((el) => {
          //     return { fileType: 'image', src: el };
          //   }).value();
          // }
          return item;
        })
        .value();
      const temp = _.get(sortedData, 'qrCodePage.descriptionText');
      if (temp) {
        sortedData.qrCodePage.descriptionText = [];
        sortedData.qrCodePage.descriptionText[0] = temp;
      }
      _(monitorUrl).forEach((item, key) => {
        const monitor = _(item)
          .map(el => ({
            [el[0]]: {
              [el[1]]: el[2],
            },
            admaster: el[3],
          }))
          .value();
        _.set(sortedData, key, monitor);
      });
      onOk({
        ...this.state.data,
        ...sortedData,
      }, promo);
    });
    // const data = _.cloneDeep(this.state.data)
    // const { style } = data

    // if (style === 0) {
    //   const { data } = this.state
    //   this.props.form.validateFields((errors, values) => {
    //     if (errors) {
    //       return false
    //     }

    //     // 监测代码
    //     if (!monitorUrlValidate(data.monitorUrl, '落地页')) {
    //       return false
    //     }

    //     if (!monitorUrlValidate(data.afterOpen.monitorUrl, '红包领取后广告')) {
    //       return false
    //     }


    //     // 提交
    //     const { getFieldValue, setFieldsValue } = this.props.form


    //     let formData = {}
    //     formData.__t = 'HongBaoAds'

    //     // 处理afteropen数据
    //     let afterOpen = Object.assign(values.afterOpen, { monitorUrl: data.afterOpen.monitorUrl })

    //     // 处理基础数据
    //     if (!getFieldValue('displayCountDown')) {
    //       values.countDownText = ''
    //     }

    //     if (!values.qrCodePage.customQrCode) {
    //       values.qrCodePage.qrCode = ''
    //     }

    //     // 处理qrcodepage
    //     let textArr
    //     let descriptionImg
    //     if (values.qrCodePage.descOption === 0) {
    //       textArr = []
    //       descriptionImg = values.qrCodePage.descriptionImg
    //     } else {
    //       descriptionImg = ''
    //       textArr = values.qrCodePage.descriptionTextString.split('\n')
    //       delete values.qrCodePage.descriptionString
    //     }
    //     let qrCodePage = {
    //       ...values.qrCodePage,
    //       descriptionText: textArr,
    //       descriptionImg
    //     }

    //     this.setState({
    //       loading: true
    //     }, async() => {
    //       await onOk(Object.assign({}, values, formData, { monitorUrl: data.monitorUrl }, { afterOpen }, { qrCodePage }))
    //       this.setState({
    //         loading: false
    //       })
    //     })
    //   })
    // } else if (style === 1 || style === 2 || style === 3) {
    //   if (data.displayCountDown && !data.countDownText) {
    //     message.error('热点标语必须要填写')
    //     return false
    //   }
    //   if (style === 3) {

    //     if (!_.isUndefined(data.descriptionTextString)) {
    //       data.qrCodePage.descriptionText[0] = data.descriptionTextString
    //     }

    //     if (!multiLineStringLimit(20)(data.qrCodePage.descriptionText[0]) || !data.qrCodePage.descriptionText[0]) {
    //       message.error('领取介绍必须要填写，且不能超过20个字符')
    //       return false
    //     }

    //   }
    //   let result = validate(data, _.find(packetConfig, item => item.style === data.style).validate)

    //   if (!result.res) {
    //     let stackList = result.stack
    //     message.error(`${_(stackList).map(item => item.key).compact().value().join(',')}${stackList[stackList.length - 1].error}`)
    //     return false
    //   }

    //   // 监测代码
    //   if (!monitorUrlValidate(data.monitorUrl, '热点图片')) {
    //     return false
    //   }

    //   if (style === 1) {
    //     // 监测代码
    //     if (!monitorUrlValidate(data.passwordPage.monitorUrl, 'banner外链')) {
    //       return false
    //     }
    //   }
    //   if (style === 2) {
    //     // 监测代码
    //     if (!monitorUrlValidate(data.passwordPage.monitorUrl, 'banner外链')) {
    //       return false
    //     }
    //   }

    //   if (style === 3) {
    //     // 监测代码
    //     if (!monitorUrlValidate(data.afterOpen.monitorUrl, '广告图片')) {
    //       return false
    //     }
    //   }

    //   let formData = null
    //   // uploadfile
    //   if (style === 2) {
    //     if (!data.promoCodePage.hadPromoCode && !data.promoCodePage.uploadFile) {
    //       message.error('请上传优惠码配置文件')
    //       return false
    //     } else {
    //       if (data.promoCodePage.uploadFile) {
    //         formData = new FormData()
    //         formData.append('promo_code', data.promoCodePage.uploadFile)
    //         delete data.promoCodePage.uploadFile
    //       }
    //     }
    //   }

    //   this.setState({
    //     loading: true
    //   }, async() => {
    //     try {
    //       await onOk({
    //         ...data
    //       }, formData)
    //     } catch ( e ) {
    //       this.setState({
    //         loading: false
    //       })
    //     }
    //   })
    // }
  }

  /**
   * skin change
   * @param index
   */
  onSkinChange = (index) => {
    const { styleConfig } = this.props;
    const { data } = this.state;
    const styleList = _(config).filter((item) => {
      return _(styleConfig.HongBaoAds.style).indexOf(item.style) >= 0;
    }).value();
    data.style = styleList[index].style;
    this.setState({ data });
  }

  render() {
    const { onCancel, isCreated, disabled, styleConfig } = this.props;
    const { data, loading } = this.state;
    const { onSkinChange, onOk } = this;

    const styleList = _(config).filter((item) => {
      return _(styleConfig.HongBaoAds.style).indexOf(item.style) >= 0;
    }).value();

    const modalProps = {
      disabled,
      isCreated,
      title: _.get(_.find(styleList, item => item.style === data.style), 'type'),
      skinTypeList: styleList,
      skin: _.findIndex(styleList, item => item.style === data.style),
      onSkinChange,
      onCancel,
      onOk,
      loading,
    };

    // const formItemLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 18 },
    //   required: true,
    // };
    // const formItemLayoutNotRequired = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 18 },
    // };

    // let hexColor = getFieldValue('qrCodePage.narrowBtnColor')
    // let rgbcolor = this.__revertColor(hexColor)

    return (
      <ResourceModal {...modalProps}>
        {
          data.style === 0
          && <Basic
            {...this.props}
            data={data}
          />
        }

        {
          data.style === 1 &&
          <MangoPassword
            {...this.props}
            data={data}
          />
        }

        {
          data.style === 2
          && <MangoPromoCode
            {...this.props}
            data={data}
          />
        }

        {
          data.style === 3
          && <MangoBarCode
            {...this.props}
            data={data}
          />
        }
      </ResourceModal >
    );
  }
}
