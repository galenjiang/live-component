// 3rd-part
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';
import { Button, Modal } from 'antd';

// self
import Carousel from '../Carousel';
import Breadcrumb from '../Breadcrumb';
import './style.less';

// @CSSModule(style, { allowMultiple: true })
export default class ResourceModal extends Component {

  static propsType = {
    isCreated: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,           // 标题
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onSkinChange: PropTypes.func.isRequired,      // 更换皮肤
    skinTypeList: PropTypes.array.isRequired,     // 广告皮肤的类型
    skin: PropTypes.number.isRequired,            // 当前 carousel 的 index 写的比较复杂
    loading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    onSkinChange: () => {},
  }

  constructor(props) {
    super();
    const { skin, isCreated, loading } = props;
    this.state = {
      step: isCreated ? 0 : 1,
      skin,
      loading: loading || false,
    };
  }

  changeSkin = (index) => {
    const { onSkinChange } = this.props;
    this.setState({
      skin: index,
    }, () => {
      onSkinChange(index);
    });
  }

  changeStep = (index) => {
    this.setState({
      step: index,
    });
  }

  render() {
    const { loading, isCreated, title, skinTypeList, onCancel, onOk } = this.props;
    const { skin, step } = this.state;
    const { changeSkin, changeStep } = this;

    const prefix = 'resource-modal';
    // const stepsStyle = {
    //   width: '50%',
    //   margin: '0 auto',
    //   padding: '0 20px'
    // }

    const modalTitleElement = (
      <div className={`${prefix}-header`}>
        {/* 左边 */}
        <section className={`${prefix}-header-title`}>
          <span style={{ marginRight: '10px' }}>{`${isCreated ? '新建' : '编辑'} ${title}`}</span>
          <Button
            onClick={onCancel}
          >
            取消
          </Button>
        </section>
        {/* 右边 */}
        {
          step === 0
            ? <section className={`${prefix}-header-submit`}>
              <Button
                onClick={() => changeStep(1)}
              >
                下一步
              </Button>
            </section>
            :
            <section className={`${prefix}-header-submit`}>
              <Button
                onClick={() => changeStep(0)}
              >
                上一步
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={onOk}
              >
                确定
              </Button>
            </section>
          }

      </div>
    );

    const ModalFooter = null;

    const BreadcrumbList = ['预览皮肤', '设置'];

    return (
      <Modal
        styleName="resource-modal"
        width={'900px'}
        visible
        title={modalTitleElement}
        ref="modal"
        footer={ModalFooter}
        closable={false}
        wrapClassName={prefix}
        onCancel={onCancel}
      >
        <div className={prefix}>
          <div className={`${prefix}-container`}>
            <div className={`${prefix}-content`}>
              <Breadcrumb
                wrapClassName={prefix}
                current={step}
                breadcrumbList={BreadcrumbList}
                onChange={step => changeStep(step)}
              />

              {
                /**
                 * step 0
                 */
              }
              <section className={`${prefix}-intro`} style={{ display: step === 0 ? 'block' : 'none' }}>

                <div className={`${prefix}-intro-skin`}>
                  <Carousel slickGoTo={skin} slidesToShow={1}>
                    {
                      skinTypeList.map(item => <div
                        className={`${prefix}-intro-skin-container`}
                        key={item.style}
                        style={{ backgroundImage: `url('${item.skin}')` }}
                      ></div>)
                    }
                  </Carousel>
                </div>

                <div className={`${prefix}-intro-footer`}>
                  {/*<div className={`${prefix}-intro-footer-choose`}>*/}
                  {
                    skinTypeList.map((item, index) => <span
                      className={`${skin === index ? 'active' : ''} ${prefix}-intro-footer-btn`}
                      key={item.style}
                    >
                      <Button
                        type="primary"
                        onClick={() => changeSkin(index)}
                        key={item.style}
                      >
                        {item.styleName || item.type}
                      </Button>
                    </span>)
                  }
                  {/*</div>*/}
                </div>
              </section>
              {
                /**
                 * step 1
                 */
              }
              <section
                className={`${prefix}-configure`}
                style={{ display: step === 1 ? 'block' : 'none' }}
              >
                {this.props.children}
              </section>
            </div>
          </div>
        </div>
      </Modal >
    );
  }
}
