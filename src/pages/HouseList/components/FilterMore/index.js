import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops-universal'
import FilterFooter from '../../../../components/FilterFooter'
import styles from './index.module.css'
export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }
  onTagClick(value) {
    const { selectedValues } = this.state
    const newSelectedValues = [...selectedValues]
    if (newSelectedValues.indexOf(value) <= -1) {
      newSelectedValues.push(value)
    } else {
      const index = newSelectedValues.findIndex(item => item === value)
      newSelectedValues.splice(index, 1)
    }
    this.setState({
      selectedValues: newSelectedValues
    })
  }
  renderFilters(data) {
    const { selectedValues } = this.state
    return data.map(item => {
      const isSelected = selectedValues.indexOf(item.value) > -1
      return (
        <span
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          onClick={() => this.onTagClick(item.value)}
        >
          {item.label}
        </span>
      )
    })
  }
  onCancel = () => {
    this.setState({
      selectedValues: []
    })
  }
  onOk = () => {
    const { type, onSave } = this.props
    onSave(type, this.state.selectedValues)
  }
  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      onCancel,
      type
    } = this.props
    const isOpen = type === 'more'
    return (
      <div className={styles.root}>
        <Spring to={{ opacity: isOpen ? 1 : 0 }}>
          {props => {
            if (props.opacity === 0) {
              return null
            }
            return (
              <div
                style={props}
                className={styles.mask}
                onClick={() => onCancel(type)}
              />
            )
          }}
        </Spring>
        <Spring
          to={{ transform: `translate(${isOpen ? '0px' : '100%'}, 0px)` }}
        >
          {props => {
            return (
              <>
                <div style={props} className={styles.tags}>
                  <dl className={styles.dl}>
                    <dt className={styles.dt}>户型</dt>
                    <dd className={styles.dd}>
                      {this.renderFilters(roomType)}
                    </dd>

                    <dt className={styles.dt}>朝向</dt>
                    <dd className={styles.dd}>
                      {this.renderFilters(oriented)}
                    </dd>

                    <dt className={styles.dt}>楼层</dt>
                    <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

                    <dt className={styles.dt}>房屋亮点</dt>
                    <dd className={styles.dd}>
                      {this.renderFilters(characteristic)}
                    </dd>
                  </dl>
                </div>
                <FilterFooter
                  style={props}
                  className={styles.footer}
                  cancelText="清除"
                  onCancel={this.onCancel}
                  onOk={this.onOk}
                />
              </>
            )
          }}
        </Spring>
      </div>
    )
  }
}