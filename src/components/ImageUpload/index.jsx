// official
import React, { Component, PropTypes } from 'react';

// 3rd-part
import { Upload, Icon, Button, message } from 'antd';
// mine
// import { liveUploadApi, liveCustomerApi } from '../../api';
// import { staticVideoJJAPI, qiniuUploadAPI } from '../../config';
import './style.less';
import ImageCropModal from './ImageCropModal';

// isMounted is an antiPattern #hack#

/*eslint-disable*/
let _isMounted;
/*eslint-enable*/

export default class ImageUploader extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      ImageCropModalVisible: false,
      fileName: '',
      fileURL: '',
    };
  }

  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onUploadChange: PropTypes.func.isRequired,
    checkFile: PropTypes.func.isRequired,
    uploadFileByBase64: PropTypes.func.isRequired,
    uploadFileByFormData: PropTypes.func.isRequired,
    fileURL: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    crop: PropTypes.bool,
    cropOptions: PropTypes.object,
  }

  static defaultProps = {
    onDelete: async () => {},
    disabled: false,
    onUploadChange() {},
    checkFile() {},
    // fileURL: '',    // antd warning remove
    crop: false,
    cropOptions: {},
  }

  componentDidMount() {
    _isMounted = true;
  }

  componentWillUnmount() {
    _isMounted = false;
  }

  /**
   * 取消裁剪
   * @private
   */
  __onCropCancel() {
    message.info('上传图片错误,您取消了裁剪');
    this.setState({ ImageCropModalVisible: false });
    return false;
  }

  /**
   * 上传前判断是否需要剪裁。。。
   * @param {any} file
   * @returns
   * @memberOf ImageUploader
   */
  beforeUpload(file) {
    const { checkFile, onUploadChange, uploadFileByFormData } = this.props;
    // check file
    checkFile(file)
      .then(({ shouldCrop }) => {

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          if (shouldCrop) {  // 剪裁
            this.setState({ loading: false, ImageCropModalVisible: true, fileName: reader.result });
          } else {     // 不需要剪裁
            uploadFileByFormData(file)
              .then((fileName) => {
                this.setState({
                  loading: false,
                  fileName: reader.result,
                }, () => {
                  onUploadChange(fileName);
                });
              });
          }
        }, false);
        reader.readAsDataURL(file);
      })
      .catch(() => {});

    return false;
    // do not auto post data in antd
  }

    /**
   * 裁剪完成后上传
   * @param base64
   * @private
   */
  __onCropEnd(base64) {
    const { uploadFileByBase64, onUploadChange } = this.props;
    this.setState({
      ImageCropModalVisible: false,
      loading: true,
    }, () => {
      uploadFileByBase64(base64)
        .then((fileName) => {
          this.setState({ loading: false, fileName });
          onUploadChange(fileName);
        });
    });
  }

  deletePicUpload = () => {
    const { onUploadChange, onDelete, index } = this.props;
    onDelete(index).then(() => {
      if (_isMounted) {
        this.setState({
          fileName: '',
        }, () => {
          onUploadChange('');
        });
      }
    })
    .catch(() => {});

  }

  __editPicUploader() {
    const { dragArea } = this.refs;
    if (dragArea) {
      dragArea.querySelector('input').click();
    }
  }

  /**
   * 删除图片
   */
  deletePic() {
    this.setState({
      fileURL: '',
    });
  }


  render() {
    const { fileURL, disabled, cropOptions, height, crop } = this.props;
    const { loading, ImageCropModalVisible, fileName } = this.state;
    const { deletePicUpload } = this;
    const prefix = 'pic-uploader';
    const isExistFile = Boolean(fileURL);

    const picViewStyles = Object.assign({}, isExistFile ? {} : { display: 'none' }, fileURL ? { backgroundImage: `url("${fileURL}")` } : {})
    return (
      <div
        className={prefix}
        style={{ height: typeof height === Number ? `${height}px` : height }}
      >
        <div className={`${prefix}-view`}>
          {
            disabled
              ? <div className={`${prefix}-disabled`}>
                <div className={`${prefix}-disabled-content`}>
                  <Icon type="cross" />
                  <p>当前不允许上传图片</p>
                </div>
              </div>
              : <div className={`${prefix}-show`}>
                <div
                  className={`${prefix}-view-mask-container`}
                  style={picViewStyles}
                >
                  <div
                    className={`${prefix}-view-mask ${loading ? 'loading' : ' '}`}
                  >
                    {
                      isExistFile && loading
                      && <span className={`${prefix}-loading`}>上传中... <Icon type="loading" /></span>
                    }
                    {
                      !loading
                      && <Button type="primary" onClick={deletePicUpload}>删除</Button>
                    }
                    {
                      !loading
                      && <Button type="primary" onClick={() => this.__editPicUploader()}>编辑</Button>
                    }
                  </div>
                </div>
                <div
                  className={`${prefix}-drag-area`}
                  ref="dragArea"
                  style={isExistFile ? { display: 'none' } : {}}
                >
                  <Upload.Dragger
                    showUploadList={false}
                    multipe={false}
                    beforeUpload={e => this.beforeUpload(e)}
                  >
                    <Icon type="plus" />
                  </Upload.Dragger>
                </div>
                {
                  !isExistFile && loading
                  && <span className={`${prefix}-loading`}>
                    上传中
                    <Icon type="loading" />
                  </span>
                }
              </div>
          }
        </div>
        {
          ImageCropModalVisible
          && <ImageCropModal
            fileName={fileName}
            cropOptions={cropOptions}
            onCropEnd={base64 => this.__onCropEnd(base64)}
            onCropCancel={() => this.__onCropCancel()}
          />
        }
      </div>
    );
  }
}
