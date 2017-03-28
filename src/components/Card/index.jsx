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
    leftText: '投放',
    rightText: '',
  }

  static propTypes = {
    onPut: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    radio: PropTypes.number,
    description: PropTypes.string.isRequired,
  }

  constructor(props) {
    super();
  }

  render() {
    const { radio, onPut, onEdit, onDelete, description, hasDelete } = this.props;
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
              <Button type="primary" onClick={onPut}>投放</Button>
            </span>
            <span styleName={`${prefix}-btn`}>
              <Button type="primary" onClick={onEdit}>
                编辑
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
