/**
 * Created by Galen on 2016/12/16.
 */
//official
import React, { Component, PropTypes } from 'react'

// third part
import classNames from 'classnames'
import { message } from 'antd'
import _ from 'lodash'

// self
import DragBody from './DragBody'
import { Drag } from '../../libs/utils'
import './DragContainer.less'

export default class DragContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }


  static propTypes = {
    dragConfig: PropTypes.array.isRequired,
    dragBodyStyle: PropTypes.object,
    canResize: PropTypes.bool,
    canDrag: PropTypes.bool
  }

  componentDidMount() {
    this.setState({
      visible: true
    })
  }

  /**
   * 开始拖拽
   * @private
   */
  startDrag() {

    let { dragBody, dragArea } = this.refs
    const { getDrag, canDrag, canResize, dragConfig, children } = this.props

//     // TODO 拖拽重构，eval unexpected token ...
//     const dragElList = []
//     const dragRefsString = children.reduce((acc, item, index) => {
//       return `${acc}dragBody${index}, `
//     }, '')
//
//     eval(`const { ${dragRefsString} } = this.refs
// const configList = children.map((item, index) => {
//       dragElList.push(eval(\`dragBody\${index}\`)) // 收集dragElement
//       return {
//         element: eval(\`dragBody\${index}\`),
//         container: dragArea,
//         enableDrag: dragConfig[index].canDrag
//       }
//     })
//
//     const resizeList = children.map((item, index) => {
//       return dragConfig[index].canResize
//         ? [{
//           type: 'SE',
//           className: '.drag-ball-modal-drag-handle-se'
//         }]
//         : false
//     })
//
//
//     this.dragList = children.map((el, index) => {
//       const drag = new Drag({
//         ...configList[index],
//         resize: resizeList[index]
//       })
//       return drag
//     })
//
//     getDrag(this.dragList, dragElList)
// `)


    const dragElList = []
    const dragRefs = this.refs
    const configList = children.map((item, index) => {
      dragElList.push(dragRefs[`dragBody${index}`]) // 收集dragElement
      return {
        element: dragRefs[`dragBody${index}`],
        container: dragArea,
        enableDrag: dragConfig[index].canDrag
      }
    })

    const resizeList = children.map((item, index) => {
      return dragConfig[index].canResize
        ? [{
          type: 'SE',
          className: '.drag-ball-modal-drag-handle-se'
        }]
        : false
    })


    this.dragList = children.map((el, index) => {
      const drag = new Drag({
        ...configList[index],
        resize: resizeList[index]
      })
      drag.start()
      return drag
    })

    getDrag(this.dragList, dragElList)

    // TODO 需进行重构，把业务逻辑代码分离出去
    // let dragFirstChild = dragBody.firstChild
    // let resize = canResize
    //   ? [{
    //     type: 'SE',
    //     className: '.drag-ball-modal-drag-handle-se'
    //   }]
    //   : false
    //
    // let dragConfigure = {
    //   element: dragBody,
    //   container: dragArea,
    //   enableDrag: canDrag
    // }

    // TODO 是否删除？ discarded
    // if (dragFirstChild.nodeName === 'IMAGE') {
    //   let width = dragFirstChild.naturalWidth
    //   let height = dragFirstChild.naturalHeight
    //
    //   //默认的 宽度 一定要比高度小
    //   let crop = width / height
    //
    //   //crop 过大的情况
    //   //也就是宽度比高度大的情况
    //   //自动缩小
    //   while (crop >= 1) {
    //     crop = crop / 2
    //   }
    //
    //   let limitWidth = ModalAdPut.dragContainer.width
    //   let limitHeight = ModalAdPut.dragContainer.height
    //
    //   if (height <= limitHeight && width < limitWidth) {
    //     dragBody.style.width = `${width}px`
    //   } else {
    //     message.info('注意:当前上传图片过大,可能影响体验,当前投放区域已经自动按照图片原本比例缩放,请重新进行缩放')
    //     dragBody.style.width = `${limitHeight * crop - 30}px`
    //   }
    // }

    // this.Drag = new Drag({
    //   ...dragConfigure,
    //   resize
    // })

    // 让父级元素获取拖拽对象
    // getDrag(this.Drag, dragBody)
    // this.Drag.start()
  }

  render() {
    let { dragConfig, children, getDrag } = this.props
    const { visible } = this.state
    const { dragArea } = this.refs
    const prefix = 'drag-ball-modal'

    // 投放效果
    // const { animation } = this.state
    // const animationMap = ['none', 'fadeIn', 'pulse', 'flip', 'breathe', 'bounce', 'daoguang', 'swing', 'ripple', 'wave']

    return (
      <section
        className={`${prefix}-drag-area`}
        ref="dragArea"
        style={{
          left: 0,
          top: 0,
        }}
      >
        {/*TODO refact multi*/}
        {
          _.range(_.min([children.length, dragConfig.length])).map((child, index) => {
            return (
              visible
              && <DragBody
                key={index}
                dragArea={dragArea}
                dragConfig={dragConfig[index]}
                dragElement={children[index]}
                getDrag={getDrag}
              />
            )
          })
        }

        <div className={`${prefix}-video-controlbar`}></div>
      </section>
    )

  }
}