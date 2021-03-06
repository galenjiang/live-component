// official
import React, { Component, PropTypes } from 'react';
import update from 'react-addons-update';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Modal, Select } from 'antd';
import _ from 'lodash';

// mine
import ResourceModal from '../../ResourceModal';
import utils from '../../../utils';
import style from './style.M.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { reg, decorators: { formCreate } } = utils;

@formCreate()
@CSSModule(style)
export default class MagicStickerAdsDistribution extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    platformList: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: {},
    platformList: {},
  }

  constructor(props) {
    super(props);

    const { data } = props;

    const dataConfig = {
      platforms: [],
    };

    this.state = {
      loading: false,
      data: _.defaults(data, dataConfig),
    };

    this.initialValue = _(props.data.platforms)
      .map(item => item._id)
      .value();
  }

  onOk = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return false;
      }
      // const sortedValues = _(values.platforms)
      //   .map(item => {
      //     return item.split('-')[0]
      //   })
      //   .value();
      onOk({ platforms: values.platforms });
    });
  }

  render() {
    const { form, onCancel, platformList } = this.props;
    const { data } = this.state;
    const { onOk } = this;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    };
    return (
      <section>
        <Modal
          visible
          onOk={onOk}
          onCancel={onCancel}
          title={'分发魔力贴'}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="投放平台"
            >
              {
                form.getFieldDecorator('platforms', {
                  initialValue: this.initialValue,
                  rules: [{
                    type: 'array',
                    required: true,
                    message: '不能为空',
                  }],
                })(<Select
                  mode="multiple"
                  optionFilterProp="children"
                >
                  {
                    _(platformList)
                      .map((value, key) => <Option
                        key={`${key}`}
                        value={`${key}`}
                      >
                        {value}
                      </Option>)
                      .value()
                  }
                </Select>)
              }
            </FormItem>
          </Form>
        </Modal>
      </section>
    );
  }
}

