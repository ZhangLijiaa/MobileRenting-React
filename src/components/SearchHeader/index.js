import React from 'react'
import { Flex } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import  PropTypes  from 'prop-types'
import './index.css'
function SearchHeader({ history,cityName }) {
  return (
    <div>
        <Flex className="search-boxs">
          <Flex className="searchs">
            <div className="location" 
            onClick={()=> history.push('/citylist')}>
              <span className="name">{cityName}</span>
              <i className="iconfont icon-arrow"></i>
            </div>
            <div className="forms" onClick={()=> history.push('/seach')}>
              <i className="iconfont icon-seach"></i>
              <span className="text">请输入小区或者地址</span>
            </div>
          </Flex>
          <i className="iconfont icon-map" onClick={()=> history.push('/map')}></i>
        </Flex>
    </div>
  )
}
SearchHeader.propTypes = {
  cityName:PropTypes.string.isRequired
}
export default withRouter(SearchHeader)