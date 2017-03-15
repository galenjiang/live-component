'use strict'
//official
import React, { Component, PropTypes } from 'react'

//Third-part
import { Button, Modal } from 'antd'
import classNames from 'classnames'

//mine
import Carousel from '../Carousel'
import './FactoryFrame.less'
import Breadcrumb from '../Breadcrumb'

export default class FactoryFrame extends Component {
  constructor(props) {
    super(props)
    const { skin, isCreating, loading } = props
    this.state = {
      step: isCreating ? 0 : 1,
      skin,
      loading: loading || false,
    }
  }

  static propsType = {
    isCreating: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired, //标题
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onSkinChange: PropTypes.func.isRequired,  // 更换皮肤
    skinTypeList: PropTypes.array.isRequired,  //广告皮肤的类型
    skin: PropTypes.number.isRequired,     // 当前 carousel 的 index 写的比较复杂
    loading: PropTypes.bool,      // loading状态
    visible: PropTypes.bool
  }

  static defaultProps = {
    onSkinChange: () => {
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loading } = nextProps
    if ('loading' in nextProps) {
      this.setState({
        loading
      })
    }
  }

  changeSkin = index => {
    const { onSkinChange } = this.props
    this.setState({
      skin: index,
    }, () => {
      onSkinChange(index)
    })
  }

  changeStep = index => {
    this.setState({
      step: index,
    })
  }

  render() {
    const { isCreating, title, skinTypeList, onCancel, onOk } = this.props
    const { loading, skin, step } = this.state
    const { changeSkin, changeStep } = this

    const classNamePrefix = 'factory-frame'
    // const stepsStyle = {
    //   width: '50%',
    //   margin: '0 auto',
    //   padding: '0 20px'
    // }

    const modalTitleElement = (
      <div className={`${classNamePrefix}-header-control`}>
        <section>
          <span style={{ marginRight: '10px' }}>{`${isCreating ? '新建' : '编辑'} ${title}`}</span>
          <Button
            onClick={onCancel}>
            取消
          </Button>
        </section>

        {
          step === 0 ?
            <section>
              <Button
                onClick={() => changeStep(1)}>
                下一步
              </Button>
            </section>
            :
            <section>
              <Button
                onClick={() => changeStep(0)}>
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
    )

    const ModalFooter = null

    const BreadcrumbList = ['预览皮肤', '设置']

    return (
      <Modal className="root"
             width={'900px'}
             visible={true}
             title={modalTitleElement}
             ref="modal"
             footer={ModalFooter}
             closable={false}
             wrapClassName={classNamePrefix}
             onCancel={onCancel}>

        <div className={classNamePrefix}>
          <div className={`${classNamePrefix}-container`}>
            <div className={`${classNamePrefix}-content`}>
              <Breadcrumb
                wrapClassName={classNamePrefix}
                current={step}
                breadcrumbList={BreadcrumbList}
                onChange={(step) => changeStep(step)}
              />

              {
                /**
                 * step 0
                 */
              }
              <section className={`${classNamePrefix}-intro`} style={{ display: step === 0 ? 'block' : 'none' }}>

                <div className={`${classNamePrefix}-intro-skin`}>
                  <Carousel slickGoTo={skin} slidesToShow={1}>
                    {
                      skinTypeList.map((item, index) => {
                        return (
                          <div
                            className={`${classNamePrefix}-intro-skin-container`}
                            key={item.style}
                            style={{ backgroundImage: `url('${item.skin}')` }}
                          ></div>
                        )
                      })
                    }
                  </Carousel>
                </div>

                <div className={`${classNamePrefix}-intro-footer`}>
                  {/*<div className={`${classNamePrefix}-intro-footer-choose`}>*/}
                  {
                    skinTypeList.map((item, index) => {
                      return (
                        <span
                          className={classNames({
                            active: skin === index,
                            [`${classNamePrefix}-intro-footer-btn`]: true,
                          })}
                          key={item.style}
                        >
                          <Button
                            type="primary"
                            onClick={() => changeSkin(index)}
                            key={item.style}
                          >
                            {item.styleName || item.type}
                          </Button>
                      </span>
                      )
                    })
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
                className={`${classNamePrefix}-configure`}
                style={{ display: step === 1 ? 'block' : 'none' }}
              >
                {this.props.children}
              </section>
            </div>
          </div>
        </div>
      </ Modal >
    )
  }
}