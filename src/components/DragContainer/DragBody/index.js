/**
 * Created by Galen on 2017/1/12.
 */
//official
import React, { Component, PropTypes } from 'react'

// 3rd part
import classNames from 'classnames'
import { message } from 'antd'
import _ from 'lodash'

// selft
import { Drag } from '../../../libs/utils'


export default class DragBody extends Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    this.startDrag()
  }

  /**
   * 开始拖拽
   * @private
   */
  startDrag() {

    let { dragBody } = this.refs
    const { dragArea, getDrag } = this.props
    const { dragConfig } = this.props

    // TODO 需进行重构，把业务逻辑代码分离出去
    let dragFirstChild = dragBody.firstChild
    let resize = dragConfig.canResize
      ? [{
        type: 'SE',
        className: '.drag-ball-modal-drag-handle-se'
      }]
      : false

    let dragConfigure = {
      element: dragBody,
      container: dragArea,
      enableDrag: dragConfig.canDrag
    }

    // TODO 是否删除？ discarded
    if (dragFirstChild.nodeName === 'IMAGE') {
      let width = dragFirstChild.naturalWidth
      let height = dragFirstChild.naturalHeight

      //默认的 宽度 一定要比高度小
      let crop = width / height

      //crop 过大的情况
      //也就是宽度比高度大的情况
      //自动缩小
      while (crop >= 1) {
        crop = crop / 2
      }

      let limitWidth = ModalAdPut.dragContainer.width
      let limitHeight = ModalAdPut.dragContainer.height

      if (height <= limitHeight && width < limitWidth) {
        dragBody.style.width = `${width}px`
      } else {
        message.info('注意:当前上传图片过大,可能影响体验,当前投放区域已经自动按照图片原本比例缩放,请重新进行缩放')
        dragBody.style.width = `${limitHeight * crop - 30}px`
      }
    }

    this.Drag = new Drag({
      ...dragConfigure,
      resize
    })

    // 让父级元素获取拖拽对象
    getDrag(this.Drag, dragBody)
    this.Drag.start()
  }

  render() {
    const { dragElement, dragConfig } = this.props
    const prefix = 'drag-ball-modal'
    return (
      <div
        className={classNames({
          [`${prefix}-drag`]: true,
          ['can-drag']: dragConfig.canDrag,
          //animation: true,  // 投放效果
          //[`animation-${animationMap[animation]}`]: true
        })}
        ref={'dragBody'}
        style={dragConfig.dragBodyStyle}
      >
        {dragElement}
        <div>
          <span className={`${prefix}-drag-handle ${prefix}-drag-handle-w`}>W</span>
          <span className={`${prefix}-drag-handle ${prefix}-drag-handle-n`}>N</span>
          <span className={`${prefix}-drag-handle ${prefix}-drag-handle-e`}>E</span>
          <span className={`${prefix}-drag-handle ${prefix}-drag-handle-s`}>S</span>
        </div>
        {
          dragConfig.canResize
          && <span
            className={`${prefix}-drag-handle resize ${prefix}-drag-handle-se`}
          >
          </span>

        }
      </div>
    )
  }
}