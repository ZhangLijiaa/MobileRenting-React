import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops-universal'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { API } from '../../../../utils/api'
import styles from './index.module.css'
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: '',
    filtersData: {
      roomType: [],
      oriented: [],
      floor: [],
      characteristic: [],
      area: {},
      subway: {},
      rentType: [],
      price: []
    },
    selectedValues
  }
  componentDidMount() {
    this.htmlBody = document.body
    this.getFiltersData()
  }
  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    this.setState({
      filtersData: res.data.body
    })
  }
  onTitleClick = type => {
    this.htmlBody.className = 'body-fixed'
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === type) {
        newTitleSelectedStatus[type] = true
        return
      }
      const selectedVal = selectedValues[key]
      if (
        key === 'area' &&
        (selectedVal.length !== 2 || selectedVal[0] !== 'area')
      ) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  onCancel = type => {
    this.htmlBody.className = ''
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = selectedValues[type]
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  onSave = (type, value) => {
    this.htmlBody.className = ''
    const { titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = value
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value
    }
    const { area, mode, price, more } = newSelectedValues
    const filters = {}
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue
    filters.mode = mode[0]
    filters.price = price[0]
    filters.more = more.join(',')
    this.props.onFilter(filters)
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues
    })
  }
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }
    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    )
  }
  renderFilterMore() {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state
    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }
    const defaultValue = selectedValues.more
    return (
      <FilterMore
        data={data}
        type={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
        defaultValue={defaultValue}
      />
    )
  }
  renderMask() {
    const { openType } = this.state
    const isHide = openType === 'more' || openType === ''
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          if (props.opacity === 0) {
            return null
          }
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() => this.onCancel(openType)}
            />
          )
        }}
      </Spring>
    )
  }
  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {this.renderMask()}
        <div className={styles.content}>
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />
          {this.renderFilterPicker()}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
