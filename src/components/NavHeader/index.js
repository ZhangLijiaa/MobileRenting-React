import React from "react";
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import  PropsTypes  from "prop-types";
import './index.css'
function NavHeader ({ children, history, onLeftClick }){
  const defaultHandler = () => history.go(-1)
      return (
        <NavBar className="navbar"
            mode="light"
            icon={<i className="iconfont icon-back"></i>}
            onLeftClick={ onLeftClick || defaultHandler }
            >{children}
        </NavBar>
      )
}
NavHeader.PropsTypes = {
  children:PropsTypes.string.isRequired,
  onLeftClick: PropsTypes.func
}
export default withRouter(NavHeader)