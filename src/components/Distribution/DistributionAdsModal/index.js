// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Modal, Select, Button, Form } from 'antd';
// self
import utils from '../../../utils';
import style from './style.M.less';

const Option = Select.Option;
const FormItem = Form.Item;



const { decorators: { formCreate } } = utils;


@formCreate()
@CSSModule(style)
export default class DistributionModal extends Component {
  static propTypes = {
    groupList: PropTypes.array.isRequired,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {
      },
    };
  }


  componentDidMount() {
  }



  onOk = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return false;
      }
      onOk(values);
    });
  }

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { form, groupList } = this.props;
    const { onCancel, onOk } = this;
    const { loading } = this.state;

    const prefix = 'distribution-modal';

    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
      required: true,
    };

    return (
      <div styleName={`${prefix}`}>
        <Modal
          visible
          title={'投放分成广告'}
          onCancel={onCancel}
          width={900}
          maskClosable={false}
          footer={<div>
            <Button
              type="primary"
              loading={loading}
              onClick={onOk}
            >
              投放广告
            </Button>
          </div>}
        >
          <Form>
            <FormItem
              {...formItemConfig}
              label="投放等级"
            >
              {
                form.getFieldDecorator('group', {
                  initialValue: [],
                  rules: [{
                    type: 'array',
                    required: true,
                    message: '不能为空',
                  }],
                })(<Select
                  multiple
                >
                  {
                    groupList.map(item => (
                      // eslint-disable-next-line
                      <Option key={item._id} value={item._id}>{item.name}</Option>
                    ))
                  }

                </Select>)
              }
            </FormItem>
          </Form>

        </Modal>
      </div>
    );
  }
}
