// official
import React, { Component, PropTypes } from 'react';

// 3rd-part
import { message } from 'antd';
// mine
import ImageUpload from '../ImageUpload';
// import { liveUploadApi, liveCustomerApi } from '../../api';
// import { staticVideoJJAPI, qiniuUploadAPI } from '../../config';
import axiosComtomed from '../../axios/axiosCustomed';
import './style.less';

const allowFileType = ['image/jpeg', 'image/png', 'image/gif'];

export default class ImageUploadCustomed extends Component {
  static propTypes = {
    // onDelete: PropTypes.func.isRequired,
    // onUploadChange: PropTypes.func.isRequired,
    fileURL: PropTypes.string,
    crop: PropTypes.bool.isRequired,
    cropOptions: PropTypes.object.isRequired,
  }

  static defaultProps = {
    axiosComtomed,
    staticVideoJJAPI: 'http://static.cdn.videojj.com',
    qiniuUploadAPI: 'http://up.qiniu.com',
  }

  constructor(props) {
    super();
    this.state = {
    };
  }

  checkFile = (file) => {
    const { crop } = this.props;
    if (!file) {
      message.error('上传图片错误,请上传图片');
      return Promise.reject();
    }

    // 图片的大小不能大于5mb
    if (file.size > 1024 * 1024 * 10) {
      message.error('上传图片错误:上传的图片文件不能大于10MB');
      return Promise.reject();
    }

    // file type
    if (allowFileType.indexOf(file.type) === -1) {
      message.error(`上传图片错误:抱歉,您上传的图片不是图片格式,请重新上传.\n上传的图片文件暂时只支持 : ${allowFileType.join(' ')},而且10mb以下的图片`);
      return Promise.reject();
    }

    if (crop && file.type !== 'image/gif') {
      return Promise.resolve({
        shouldCrop: true,
      });
    }
    return Promise.resolve({
      shouldCrop: false,
    });
  }

  uploadFileByBase64 = (base64) => {
    const { staticVideoJJAPI, qiniuUploadAPI, axiosComtomed } = this.props;
    // liveUploadApi.liveUploadApiToken()
    return axiosComtomed.get('api/common/upload/image')
      .then(data => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            const fileName = `${staticVideoJJAPI}/${xhr.response.key}`;
            resolve(fileName);
          }
        };
        xhr.open('POST', `${qiniuUploadAPI}/putb64/-1`, true);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Authorization', `UpToken ${data.fields.token}`);
        xhr.send(base64.substring('data:image/png;base64,'.length, base64.length));
      }));
  }

  uploadFileByFormData = (file) => {
    const { staticVideoJJAPI, qiniuUploadAPI, axiosComtomed } = this.props;
    // return liveUploadApi.liveUploadApiToken()
    return axiosComtomed.get('api/common/upload/image')
      .then((data) => {
        const fd = new FormData();
        fd.append('token', data.fields.token);
        fd.append('file', file);
        // return liveCustomerApi('post', qiniuUploadAPI, fd);
        return axiosComtomed.post(qiniuUploadAPI, fd);
      }).then((data) => {
        const fileName = `${staticVideoJJAPI}/${data.key}`;
        return Promise.resolve(fileName);
      });
  }

  render() {
    const { checkFile, uploadFileByBase64, uploadFileByFormData } = this;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ImageUpload
          {...this.props}
          checkFile={checkFile}
          uploadFileByBase64={uploadFileByBase64}
          uploadFileByFormData={uploadFileByFormData}
        />
      </div>
    );
  }

}
