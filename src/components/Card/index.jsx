/**
 * Created by Galen on 2016/11/23.
 */
// official
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { Icon, Button } from 'antd';
import style from './style.M.less';

@CSSModules(style)
export default class Card extends Component {
  static defaultProps = {
    radio: 1,
    onDelete: () => {},
    hasDelete: false,
    leftText: '投放',
    rightText: '编辑',
    description: '',
  }

  static propTypes = {
    onPut: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    hasDelete: PropTypes.bool,
    onDelete: PropTypes.func,
    radio: PropTypes.number,
    leftText: PropTypes.string,
    rightText: PropTypes.string,
    description: PropTypes.string,
  }

  constructor(props) {
    super();
  }

  render() {
    const { radio, onPut, onEdit, onDelete, description, hasDelete, leftText, rightText } = this.props;
    const prefix = 'live-card';

    return (
      <div styleName={`${prefix}-container`}>
        <div styleName={`${prefix}-body`}>
          <div styleName={`${prefix}-content`}>
            {this.props.children}
          </div>
          <div styleName={`${prefix}-bar`} style={{ paddingTop: `${(1 / radio) * 100}%` }} />
          <div styleName={`${prefix}-mask`}>
            <span styleName={`${prefix}-btn`}>
              <Button type="primary" onClick={onPut}>{leftText}</Button>
            </span>
            <span styleName={`${prefix}-btn`}>
              <Button type="primary" onClick={onEdit}>
                {rightText}
              </Button>
            </span>
          </div>
        </div>
        <div styleName={`${prefix}-title`}>
          <span styleName={`${prefix}-description`}>
            {description}
          </span>
          {
            hasDelete
            && <div styleName={`${prefix}-delete`}>
              <Icon type="delete" onClick={onDelete} />
            </div>
          }
        </div>
      </div>
    );
  }
}
