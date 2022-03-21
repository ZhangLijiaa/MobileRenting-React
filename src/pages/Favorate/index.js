import React from 'react'
import NavHeader from '../../components/NavHeader/index'
import { Toast } from 'antd-mobile';
import './index.css'
import { API } from '../../utils/api';
import { BASE_URL } from '../../utils/url';
export default class Favorate extends React.Component {
  state = {
    housesList: []
  }
  componentDidMount() {
     this.getHousesCollectInfo()
  }
async getHousesCollectInfo(){
    try {
      Toast.loading('数据加载中...', 0, null, false)
      const res = await API.get('/user/favorites')
      Toast.hide()
    this.setState({
        housesList:res.data.body,
    })
    } catch (error) {
      Toast.hide()
    }
}
  render() {
    return (
      
      <div className="favorate">
         <NavHeader>我的收藏</NavHeader>
        <div className="houseItems">
              {this.state.housesList.map(item =>  
              <div className="house" key={item.houseCode}>
              <div className="imgWrap">
                <img className="img" src={BASE_URL + item.houseImg} alt="" />
              </div>
              <div className="content">
                <h3 className="titles">
                  {item.title}
                </h3>
                <div className="desc">{item.desc}</div>
                <div>
                  {
                    item.tags.map(tag =>
                       <span className='tag' key={tag}>{tag}</span>)
                  }
                </div>
                <div className="price">
                  <span className="priceNum">{item.price}</span> 元/月
                </div>
              </div>
            </div>)}
          </div>
      </div>
    )
  }
}
