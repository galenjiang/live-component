// official
import React, { Component, PropTypes } from 'react';

// Third-part
import _ from 'lodash';
// mine

import ModalAdPicture from './PictureAdsResource';
import ModalAdRedPackets from './RedPacketAdsModel';
import ModalAdVideo from './VideoAdsResource';
import ModalAdText from './TextAdsResource';
import ModalAdVote from './VoteAdsResource';
import SidebarModel from './SidebarAdsModel';

import { constantsAdsMap } from '../../constants';

export default class AdsFactoryModal extends Component {
  constructor(props) {
    super(props)

    this.ModalAdMap = {
      PicAds: ModalAdPicture,
      VideoAds: ModalAdVideo,
      HongBaoAds: ModalAdRedPackets,
      VoteAds: ModalAdVote,
      TextAds: ModalAdText,
      SideBarAds: SidebarModel,
    }
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  static defaultProps = {
    type: 'PicAds',
    onOk(){
    },
    onCancel(){
    }
  }

  render() {
    let { type, ModalAdFactory } = this.props
    //如果在 map 当中不存在 就不渲染
    if (!constantsAdsMap[type]) {
      console.warn(`can not find ${type} modal type in ${Object.keys(constantsAdsMap).join((' '))}`)
      return false
    }

    let Factory = this.ModalAdMap[type]
    if (Factory) {
      ModalAdFactory = _.cloneDeep(ModalAdFactory)
      return (
        ModalAdFactory.visible &&  // 准备重构
        <Factory
          data={ModalAdFactory.data}
          isCreateBall={ModalAdFactory.isCreateBall}
          onOk={(value, promoData) => this.props.onOk(value, promoData)}
          onCancel={() => this.props.onCancel()}
        />
      )
    } else {
      console.warn(`can not find ${type} ModalAdMap in ${Object.keys(this.ModalAdMap).join((' '))}`)
    }
    return null
  }
}
