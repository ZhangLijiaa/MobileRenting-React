import React, { Component } from 'react'
import { SearchBar } from 'antd-mobile'
import {getCity,  API } from '../../../utils'
import styles from './index.module.css'
export default class Search extends Component {
  cityId = getCity().value
  timerId = null
  state = {
    searchTxt: '',
    tipsList: []
  }
  onTipsClick = item => {
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community
    })
  }
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => this.onTipsClick(item)}
      >
        {item.communityName}
      </li>
    ))
  }
  handleSearchTxt = value => {
    this.setState({ searchTxt: value })
    if (!value) {
      return this.setState({
        tipsList: []
      })
    }
    clearTimeout(this.timerId)
    this.timerId = setTimeout(async () => {
      const res = await API.get('/area/community', {
        params: {
          name: value,
          id: this.cityId
        }
      })
      this.setState({
        tipsList: res.data.body
      })
    }, 500)
  }
  render() {
    const { history } = this.props
    const { searchTxt } = this.state
    return (
      <div className={styles.root}>
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handleSearchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
