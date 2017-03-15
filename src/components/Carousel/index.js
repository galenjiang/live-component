import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';

import './style.less';

export default class Carousel extends Component {

  static defaultProps = {
    dots: false,
    slickGoTo: null
  }

  static propTypes = {
    slidesToShow: PropTypes.number.isRequired,
    slickGoTo: PropTypes.number,
    dots: PropTypes.bool
  }

  constructor(props) {
    super(props)
    const trackWidth = 'auto'
    const trackCount = 0

    const trackItemWidth = 0
    const carouselIndex = 0
    this.state = { trackWidth, trackItemWidth, carouselIndex, trackCount }
  }

  componentWillReceiveProps(nextProps) {
    let { trackCount } = this.state
    let nextCount = nextProps.children.length

    //add new track item or remove track item
    if (trackCount !== nextCount) {
      let nextIndex = nextCount - this.props.slidesToShow

      this.setState({
        trackCount: nextCount,
        carouselIndex: nextIndex >= 0 ? nextIndex : 0
      })

      return false
    }

    //slick go to
    let { slickGoTo } = nextProps
    if (typeof slickGoTo === 'number') {
      let { carouselIndex } = this.state
      const { slidesToShow } = this.props
      if (carouselIndex !== slickGoTo && slickGoTo >= 0 && slickGoTo <= nextCount - slidesToShow) {
        this.setState({
          carouselIndex: slickGoTo
        })
      }
    }
  }

  componentDidMount() {
    let trackWidth = this.refs.track.offsetWidth
    let trackCount = this.props.children.length
    const { slidesToShow, slickGoTo } = this.props
    this.setState({
      trackWidth,
      trackItemWidth: trackWidth / slidesToShow,
      trackCount,
      carouselIndex: slickGoTo || 0
    })
  }

  /**
   * prev
   * @private
   */
  __prev() {
    let { carouselIndex } = this.state
    carouselIndex--
    if (carouselIndex < 0) {
      return false
    }
    this.setState({ carouselIndex })
  }

  /**
   * next
   * @private
   */
  __next() {
    let { carouselIndex, trackCount } = this.state
    const { slidesToShow } = this.props
    carouselIndex++
    if (carouselIndex > trackCount - slidesToShow) {
      return false
    }
    this.setState({ carouselIndex })
  }

  render() {
    const className = 'carousel'

    const { carouselIndex } = this.state
    const { dots, children } = this.props

    let trackItemWidth = this.refs.track && this.refs.track.parentNode.offsetWidth / this.props.slidesToShow || 0
    const trackStyle = {
      width: trackItemWidth * this.props.children.length,
      transform: `translate3d(${-carouselIndex * trackItemWidth}px,0px,0px)`
    }

    const trackItemStyle = {
      width: trackItemWidth
    }

    return (
      <div className={className}>
        <div className={`${className}-initialized`}>
          <div className={`${className}-list`}>
            <div className={`${className}-track`} style={trackStyle} ref="track">
              {
                React.Children.map(children, function (child) {
                  return (
                    <div className={`${className}-track-item`} style={trackItemStyle}>
                      {child}
                    </div>
                  )
                })
              }
            </div>
          </div>
          {
            children.length > 0 && dots &&
            <div className={`${className}-dots`}>
              <Button type="primary" icon="left" onClick={()=>this.__prev()}></Button>
              <Button type="primary" icon="right" onClick={()=>this.__next()}></Button>
            </div>
          }
        </div>
      </div>
    )
  }
}
