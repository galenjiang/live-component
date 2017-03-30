/**
 * Created by Galen on 2016/12/20.
 */
// official
import React, { Component, PropTypes } from 'react';

// third part
import _ from 'lodash';
import { Icon, Button, message } from 'antd';
import CSSModules from 'react-css-modules';

import ImageUploadCustomed from '../ImageUploadCustomed';
import styles from './ImageGroup.M.less';

@CSSModules(styles)
export default class ImageGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [...props.images].map(item => {
        return {
          key: _.uniqueId(),
          value: item,
        };
      }),
    };
  }

  static propTypes = {
    images: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    cropConfig: PropTypes.object,
    imageStyle: PropTypes.object,
    maxLength: PropTypes.number,
    minLength: PropTypes.number,
  }
  static defaultProps = {
    imageStyle: { width: '160px', height: '200px' },
    cropConfig: {
      crop: false,
      disabled: false,
      cropOptions: {
        aspect: 1,
      }
    }
  }

  setFields = (index, value) => {
    const { images } = this.state;
    const { onChange } = this.props;
    images[index].value = value;
    this.setState({
      images,
    }, () => {
      onChange(images);
    });
  }

  addImageItem = () => {
    const { images } = this.state
    const { onChange, maxLength } = this.props
    if (maxLength && images.length >= maxLength) {
      message.error(`可添加图片不能大于${maxLength}张`)
      return false
    }
    images.push({
      key: _.uniqueId(),
      value: '',
    })
    this.setState({
      images,
    }, () => {
      onChange(images)
    })
  }

  deleteImageItem = index => {
    const { images } = this.state
    const { onChange, minLength } = this.props
    if (minLength && images.length <= minLength) {
      message.error(`可添加图片不能小于${minLength}张`)
      return Promise.reject();
    }
    images.splice(index, 1);
    this.setState({
      images,
    }, () => {
      onChange(images);
    });
    return Promise.resolve();
  }

  render() {
    const props = _.cloneDeep(this.props);
    const { maxLength, disabled } = props;
    const { images } = this.state;
    const { setFields, addImageItem, deleteImageItem } = this;
    return (
      <div styleName="container">

        {
          images.map((item, index) => {
            return (
              <div
                styleName="item"
                style={props.imageStyle}
                key={item.key}
              >
                <ImageUploadCustomed
                  disabled={disabled}
                  axiosComtomed={this.props.axiosComtomed}
                  staticVideoJJAPI={this.props.staticVideoJJAPI}
                  qiniuUploadAPI={this.props.qiniuUploadAPI}
                  {...props.cropConfig}
                  fileURL={item.value}
                  onDelete={() => deleteImageItem(index)}
                  onUploadChange={value => setFields(index, value)}
                />
              </div>
            )
          })
        }
        {
          (!maxLength || maxLength > 1) && !disabled
          && <div styleName="button-container">
            <Button
              onClick={addImageItem}
            >添加</Button>
          </div>

        }
        {/*
         <div
         styleName='add'
         style={props.imageStyle || { width: '160px', height: '200px' }}
         >
         <Icon
         type="plus"
         />
         </div>
         */}
      </div>
    )
  }
}
