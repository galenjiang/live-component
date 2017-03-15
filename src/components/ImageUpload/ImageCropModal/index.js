// official
import React, { Component, PropTypes } from 'react';

// 3rd-part
import { Icon, Button, message, Modal } from 'antd';
import ReactCrop from '../../ImageCrop';
// mine
import Event from '../../../utils/event';
import './style.less';

const EVENT_KEY = 'ON_DROP_COMPLETE';

class ImageCropModalCropView extends Component {
  constructor(props) {
    super();
    const base64 = 'data:image/gifbase64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const cropWidth = 0;
    const cropHeight = 0;
    this.state = { base64, cropWidth, cropHeight };
    Event.$on(EVENT_KEY, ({ base64, cropWidth, cropHeight })=> {
      this.setState({ base64, cropWidth, cropHeight })
    });
  }

  render() {
    const { base64, cropWidth, cropHeight } = this.state;
    const classNamePrefix = 'ImageCropModal';
    return (
      <div className={`${classNamePrefix}-view`}>
        <div style={{ backgroundImage: `url(${base64})`, width: cropWidth, height: cropHeight }}></div>
      </div>
    );
  }
}

export default class ImageCropModal extends Component {
  constructor(props) {
    super();
    const base64 = 'data:image/gifbase64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const loading = false;
    const cropWidth = 0;
    const cropHeight = 0;
    this.state = { base64, loading, cropWidth, cropHeight };
  }

  static propsTypes = {
    fileName: PropTypes.string.isRequired,
    onCropEnd: PropTypes.func.isRequired,
    onCropCancel: PropTypes.func.isRequired,
    cropOptions: PropTypes.Object,
  }

  static defaultProps = {
    fileName: '',
    onCropEnd() { },
    onCropCancel() { },
    cropOptions: {},
  }

  /**
   * 设置 base 64 预览
   * @param base64
   * @private
   */
  __setImageBase64(base64, cropWidth, cropHeight) {
    this.state.base64 = base64;
    Event.$emit(EVENT_KEY, { base64, cropWidth, cropHeight });
  }

  __onOkClick() {
    let { base64 } = this.state;
    if (base64 === 'data:image/gifbase64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==') {
      message.info(`裁剪提示:请裁剪图片`);
      return false;
    } else {
      this.props.onCropEnd && this.props.onCropEnd(base64);
    }
  }

  componentWillUnmount() {
    Event.$clear(EVENT_KEY);
  }

  render() {
    const classNamePrefix = 'ImageCropModal';
    const { base64, loading, cropWidth, cropHeight } = this.state;
    const { fileName, cropOptions } = this.props;
    return (
      <Modal
        confirmLoading={loading}
        visible
        onOk={() => this.__onOkClick()}
        onCancel={() => this.props.onCropCancel()}
        title="图片上传裁剪"
        maskClosable={false}
      >
        <div className={classNamePrefix}>
          <p>上传图片缩略图:</p>
          <div className={`${classNamePrefix}-detail`}>
            {
              Object.keys(cropOptions).length
              ? <ReactCrop
                src={fileName}
                crop={cropOptions}
                onCompleteAutoToBase64={(base64, cropWidth, cropHeight) => this.__setImageBase64(base64, cropWidth, cropHeight)}
              />
              : <ReactCrop
                src={fileName}
                onCompleteAutoToBase64={(base64, cropWidth, cropHeight) => this.__setImageBase64(base64, cropWidth, cropHeight)}
              />
            }
          </div>
          <p>裁剪后显示图片实际大小:</p>
          {/* <div className={`${classNamePrefix}-view`}> */}
          {/* <div style={{ backgroundImage: `url(${base64})`, width: cropWidth, height: cropHeight }}></div> */}
          {/* </div> */}
          <ImageCropModalCropView />
        </div>
      </Modal>
    );
  }
}
