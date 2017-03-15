/**
 * Created by Galen on 2016/12/16.
 */
//official
import React, { Component, PropTypes } from 'react'

// third part
import classNames from 'classnames'
import { message } from 'antd'

// self
import { Drag } from '../../libs/utils'
import './DragBallModal.less'

export default class DragBallModel extends Component {
  constructor(props) {
    super(props)
  }


  static propTypes = {
    dragBodyStyle: PropTypes.object.isRequired,
    canResize: PropTypes.bool.isRequired,
    canDrag: PropTypes.bool.isRequired
  }


  componentDidMount() {
    this.startDrag()
  }

  /**
   * 开始拖拽
   * @private
   */
  startDrag() {
    let { dragBody, dragArea } = this.refs
    const { getDrag, canDrag, canResize } = this.props
    //TODO 需进行重构，把业务逻辑代码分离出去
    let dragFirstChild = dragBody.firstChild
    let resize = canResize ? [{
      type: 'SE',
      className: '.drag-ball-modal-drag-handle-se'
    }] : false

    let dragConfigure = {
      element: dragBody,
      container: dragArea,
      enableDrag: canDrag
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
    let { canDrag, canResize, dragBodyStyle } = this.props
    const prefixClassName = 'drag-ball-modal'

    // 投放效果
    // const { animation } = this.state
    // const animationMap = ['none', 'fadeIn', 'pulse', 'flip', 'breathe', 'bounce', 'daoguang', 'swing', 'ripple', 'wave']

    return (
      <section
        className={`${prefixClassName}-drag-area`}
        ref="dragArea"
        style={{
          left: 0,
          top: 0,
        }}
      >
        {/*put ball model*/}
        <div
          className={classNames({
            [`${prefixClassName}-drag`]: true,
            ['can-drag']: canDrag,
            // 投放效果
            //animation: true,
            //[`animation-${animationMap[animation]}`]: true
          })}
          ref="dragBody"
          style={dragBodyStyle}
        >
          {this.props.children}
          <div>
            <span className={`${prefixClassName}-drag-handle ${prefixClassName}-drag-handle-w`}>W</span>
            <span className={`${prefixClassName}-drag-handle ${prefixClassName}-drag-handle-n`}>N</span>
            <span className={`${prefixClassName}-drag-handle ${prefixClassName}-drag-handle-e`}>E</span>
            <span className={`${prefixClassName}-drag-handle ${prefixClassName}-drag-handle-s`}>S</span>
          </div>
          {
            canResize &&
            <span
              className={`${prefixClassName}-drag-handle resize ${prefixClassName}-drag-handle-se`}
              ref="dragSE">
          </span>

          }
        </div>
        <div className={`${prefixClassName}-video-controlbar`}></div>
      </section>
    )

  }
}