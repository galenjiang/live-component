import React, { Component } from 'react';
import CSSModule from 'react-css-modules';
import { Row, Col, Button } from 'antd';
import _ from 'lodash';

import PictureAdsResource from '../../../components/AdsResource/PictureAdsResource';
import VideoAdsResource from '../../../components/AdsResource/VideoAdsResource';
import TextAdsResource from '../../../components/AdsResource/TextAdsResource';
import VoteAdsResource from '../../../components/AdsResource/VoteAdsResource';
import SideBarAdsResource from '../../../components/AdsResource/SideBarAdsResource';
import RedPacketAdsResource from '../../../components/AdsResource/RedPacketAdsResource';
import style from './style.M.less';

const pictureResource = {
  __t: 'PicAds',
  style: 0,
  title: '',
  webLinkOption: 0,
  url: 'http://static.cdn.videojj.com/FvHTn-FMCJh7ZQEQXk93uzSpPmUI',
  webSideBar: '1',
  mobileLinkOption: 0,
  mobileUrl: 'http://static.cdn.videojj.com/FvHTn-FMCJh7ZQEQXk93uzSpPmUI',
  mobileSideBar: '2',
  desc: '',
  pic: 'http://static.cdn.videojj.com/FvHTn-FMCJh7ZQEQXk93uzSpPmUI',
  monitorUrl: [
    ['all', 'click', 'http://www.baidu.com', true],
    ['web', 'view', 'http://www.baidu.com', false],
  ],
};

const videoResource = {
  __t: 'VideoAds',
  style: 0,
  title: '',
  totalEx: 0,
  videoList: [],
  isPiP: false,
  allowClose: true,
  closeTime: 0,
  usePlayerVolume: true,
  volume: 50,
};

const textResource = {
  __t: 'TextAds',
  title: 'title',
  style: 0,  // 皮肤类型
  textList: [{
    style: 0,
    content: '111',
    linkOption: 0,  // 0 打开网页  1 打开侧边栏
    url: 'http://www.baidu.com',
    sideBar: '1',
    icon: 'http://static.cdn.videojj.com/FvHTn-FMCJh7ZQEQXk93uzSpPmUI',
    monitorUrl: [
      // {
      // admaster: false,
      // ios: { click: 'http://www.baidu.com' },
    // }, {
      // admaster: false,
    //  ios: { view: 'http://www.baidu.com' },
    // }
      ['all', 'click', 'http://www.baidu.com', true],
      ['web', 'view', 'http://www.baidu.com', false],
    ],
  }, {
    style: 2,
    content: '3333',
    linkOption: 0,  // 0 打开网页  1 打开侧边栏
    url: 'http://www.baidu.com',
    sideBar: '2',
    icon: 'http://www.baidu.com',
    monitorUrl: [],
  }, {
    style: 1,
    content: '2222',
    linkOption: 0,  // 0 打开网页  1 打开侧边栏
    url: 'http://www.baidu.com',
    sideBar: '3',
    icon: 'http://www.baidu.com',
    monitorUrl: [],
  }],
};

const voteResource = {
  __t: 'VoteAds',
  style: 0,                       // 样式
  voteRepeat: false,              // 是否允许重复投票
  qoptionsType: 0,                // 选项类型 0: 百分比 1: 纯数字
  titlePic: '',                   // 标题图片地址
  votePic: 'http://videojj-cdn.oss-cn-beijing.aliyuncs.com/images/web/live/common/banner-come-on-vote.png',                           // 标题图片地址
  title: '',                      // 标题
  url: '',                        // 外链
  multiple: 1,                    // 倍数
  specifyIdx: '-1',
  upPlace: 0,                     // 向上位移
  monitorUrl: [],
  votePicMonitorUrl: [
    ['all', 'click', 'http://www.baidu.com', true],
    ['web', 'view', 'http://www.baidu.com', false],
  ],
  qoptions: [{
    key: _.uniqueId(),
    title: '',
    pic: '',
  }],
};

const sideBarResource = {
  __t: 'SideBarAds',
  style: 0,
  title: '',
  icon: '',
  cover: [
    { fileType: 'image', src: '' },
  ],
  coverLink: '',
  coverLinkMonitorUrl: [],
  themeColor: 1,
  textTitle: '',
  textDescription: '',
  btn: {
    content: '',
    link: '',
  },
  needPraised: true,
  linkBtnMonitorUrl: [],
};

const redPacketResource = {
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
};


const adsTypeList = ['TextAds', 'PicAds', 'VideoAds', 'VoteAds', 'SideBarAds', 'HongBaoAds'];

@CSSModule(style)
export default class AdsResource extends Component {
  constructor() {
    super();
    this.state = {
      visible: '',
    };
  }

  createResource = (type) => {
    this.setState({
      visible: type,
    });
  }

  cancelResource = () => {
    this.setState({
      visible: '',
    });
  }

  submitResource = (data) => {
    console.log(data);
    this.setState({
      visible: '',
    });
  }

  render() {
    const { visible } = this.state;
    const { createResource, cancelResource, submitResource } = this;
    return (
      <section styleName="ads-resource">
        <Row>
          <Col span={4} offset={1} style={{ marginBottom: '15px' }}>
            <Button onClick={() => createResource('PicAds')}>新建图片资源</Button>
          </Col>
          <Col span={4} offset={1} style={{ marginBottom: '15px' }}>
            <Button onClick={() => createResource('VideoAds')}>新建中插广告资源</Button>
          </Col>
          <Col span={4} offset={1} style={{ marginBottom: '15px' }}>
            <Button onClick={() => createResource('TextAds')}>新建图文链资源</Button>
          </Col>
          <Col span={4} offset={1} style={{ marginBottom: '15px' }}>
            <Button onClick={() => createResource('VoteAds')}>新建投票资源</Button>
          </Col>
          <Col span={4} offset={1} style={{ marginBottom: '15px' }}>
            <Button onClick={() => createResource('SideBarAds')}>新建侧边栏资源</Button>
          </Col>
          <Col span={4} offset={1} style={{ marginBottom: '15px' }}>
            <Button onClick={() => createResource('HongBaoAds')}>新建红包资源</Button>
          </Col>
          {
            visible === 'PicAds'
            && <PictureAdsResource
              isCreated
              data={pictureResource}
              sidebarAdsList={[{ _id: '1', title: 'a' }, { _id: '2', title: 'b' }, { _id: '3', title: 'c' }]}
              onOk={submitResource}
              onCancel={cancelResource}
            />
          }
          {
            visible === 'VideoAds'
            && <VideoAdsResource
              isCreated
              data={videoResource}
              onOk={submitResource}
              onCancel={cancelResource}
            />
          }
          {
            visible === 'TextAds'
            && <TextAdsResource
              isCreated
              data={textResource}
              sidebarAdsList={[{ _id: '1', title: 'a' }, { _id: '2', title: 'b' }, { _id: '3', title: 'c' }]}
              onOk={submitResource}
              onCancel={cancelResource}
            />
          }
          {
            visible === 'VoteAds'
            && <VoteAdsResource
              isCreated
              data={voteResource}
              onOk={submitResource}
              onCancel={cancelResource}
            />
          }
          {
            visible === 'SideBarAds'
            && <SideBarAdsResource
              isCreated
              data={sideBarResource}
              onOk={submitResource}
              onCancel={cancelResource}
            />
          }
          {
            visible === 'HongBaoAds'
            && <RedPacketAdsResource
              isCreated
              data={redPacketResource}
              onOk={submitResource}
              onCancel={cancelResource}
            />
          }
        </Row>
      </section>

    );
  }
}
