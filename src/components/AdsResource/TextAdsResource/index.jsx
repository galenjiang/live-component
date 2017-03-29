// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import _ from 'lodash';

// self
import Basic from './TextAdsForm/Basic';
import Classic from './TextAdsForm/Classic';
import ResourceModal from '../../ResourceModal';
import config from './config';
import event from '../../../utils/event';
import style from './style.M.less';

@CSSModule(style)
export default class TextAdsResource extends Component {

  static propsType = {
    disabled: PropTypes.boolean,
    data: PropTypes.object,
    isCreated: PropTypes.bool,
    sidebarAdsList: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    isCreated: true,
    data: {},
    sidebarAdsList: [],
    onOk: () => {},
    onCancel: () => {},
  }

  constructor(props) {
    super();
    const { data } = props;

    const modelConfig = {
      __t: 'TextAds',
      title: '',
      style: 0,  // 皮肤类型
      textList: [{
        key: _.uniqueId(),
        style: 0,
        content: '',
        linkOption: 0,  // 0 打开网页  1 打开侧边栏
        url: '',
        sideBar: _.get(props.sidebarAdsList, '[0]._id', ''),
        icon: '',
        monitorUrl: [],
      }],
    };

    const sortedData = _(data)
      .mapValues((item, key) => {
        if (key === 'textList') {
          return _(item)
            .map((textItem) => {
              textItem.key = _.uniqueId();
              textItem.sideBar = textItem.sideBar || _.get(props.sidebarAdsList, '[0]._id', '');
              return textItem;
            })
            .value();
        }
        return item;
      })
      .value();

    this.state = {
      loading: false,
      data: _.defaults(sortedData, modelConfig),
    };
  }

  /**
   * 提交的时候
   * @private
   */
  onOk = () => {
    const { onOk } = this.props;
    event.$emit('validateFields', (values, monitorUrl) => {
      const data = _(values).omit('textListIndex').value();
      _(monitorUrl).forEach((item, key) => {
        const monitor = _(item)
          .map(el => ({
            [el[0]]: {
              [el[1]]: el[2],
            },
            admaster: el[3],
          }))
          .value();
        _.set(data, key, monitor);
      });
      onOk({
        ...this.state.data,
        ...data,
        title: data.textList[0].content,
      });
    });
  }

  /**
   * skin change
   * @param index
   * @private
   */
  onSkinChange = (index) => {
    const { data } = this.state;
    data.style = config[index].style;
    this.setState({ data });
  }

  render() {
    const { onCancel, isCreated, disabled } = this.props;
    const { loading, data } = this.state;
    const { onSkinChange, onOk } = this;

    const modalProps = {
      disabled,
      isCreated,
      title: _.find(config, item => item.style === data.style).type,
      skinTypeList: config,
      skin: _.findIndex(config, item => item.style === data.style),
      onSkinChange,
      onOk,
      onCancel,
      loading,
    };

    return (
      <ResourceModal
        {...modalProps}
      >
        {
          data.style === 0
          && <Basic
            {...this.props}
            data={data}
          />
        }
        {
          data.style === 1
          && <Classic
            {...this.props}
            data={data}
          />
        }
      </ResourceModal>
    );
  }
}
