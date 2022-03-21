import React from 'react'
import { Carousel, Flex, Grid,WingBlank  } from 'antd-mobile'
import { API } from '../../utils/api';
import './index.css'
import { getCurrentCity } from '../../utils'
import { BASE_URL } from '../../utils/url';
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
const navs = [
  { id: 1, img: Nav1, title: '整租', path: '/home/list' },
  { id: 2, img: Nav2, title: '合租', path: '/home/list' },
  { id: 3, img: Nav3, title: '地图找房', path: '/map' },
  { id: 4, img: Nav4, title: '去出租', path: '/rent/add' },
]
export default class Index extends React.Component {
  state = {
    swipers: [],
    isSwiperLoaded:false,
    groups:[],
    news:[],
    cityName:'贵阳',
  }
  async getSwipers() {
    const res = await API.get('/home/swiper')
    if(res.status===200){
        this.setState({
           swipers: res.data.body,
          isSwiperLoaded:true
        })
    }
  }
  async getGoups(){
    const res= await API.get('/home/groups',{
      params:{
              area:'AREA%7C88cff55c-aaa4-e2e0'
            }
      })
       if(res.status===200){
            this.setState({
               groups:res.data.body
          })
       }
  }
  async getNews(){
    const res= await API.get('/home/news',{
      params:{
            area:'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    if(res.status===200){
          this.setState({
            news:res.data.body
          })
    }
  }
  async componentDidMount() {
    this.getSwipers()
    this.getGoups()
    this.getNews()
    const curCity = await getCurrentCity()
    this.setState({
      cityName:curCity.label
    })
  }
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212,
        }}
      >
        <img
          src={`${BASE_URL}${item.imgSrc}`}
          alt=""
          style={{ width: '100%', height: '212', verticalAlign: 'top' }}
        />
      </a>
    ))
  }
  renderNavs() {
    return navs.map((item) => (
      <Flex.Item key={item.id} onClick={()=>this.props.history.push(item.path)}>
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }
  renderNews(){
    return this.state.news.map(item =>(
        <div className="news-item" key={item.id}>
            <div className="imgwrap">
                    <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
            </div>
            <Flex className="content" 
                direction="column" justify="between">
                <h3 className="title">{item.title}</h3>
                <Flex className="info" justify="start">
                  <span>{item.from}</span>
                  <span>{item.date}</span>
                </Flex>
              </Flex>
        </div>
    ))
  }
  render() {
    return (
      <div className="index">
        <div className="swiper">
          {this.state.isSwiperLoaded?( <Carousel autoplay infinite 
          dotActiveStyle={{ backgroundColor:'#0EF8D6'}}
          dotStyle={{backgroundColor:'#FFF'}}>
          {this.renderSwipers()} 
        </Carousel>):('')}
        <Flex className="search-box">
          <Flex className="search">
            <div className="location" 
            onClick={()=> this.props.history.push('/citylist')}>
              <span className="name">{this.state.cityName}</span>
              <i className="iconfont icon-arrow"></i>
            </div>
            <div className="form" onClick={()=> this.props.history.push('/seach')}>
              <i className="iconfont icon-seach"></i>
              <span className="text">请输入小区或者地址</span>
            </div>
          </Flex>
          <i className="iconfont icon-map" onClick={()=> this.props.history.push('/map')}></i>
        </Flex>
        </div>
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>
        <div className='goups'>
          <h3 className='title'>
            租房小组<span className='more'>更多</span>
          </h3>
         <Grid data={this.state.groups} columnNum={2} square={false} hasLine={false}
          renderItem={(item) => (
              <Flex className='group-item' justify="around" key="{item.id}">
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
              </Flex>
         )} />
        </div>
        <div className="news">
          <h3 className="news-title">最新咨询</h3>
          <WingBlank size="md">
               {this.renderNews()}
          </WingBlank>
        </div>
      </div>
    )
  }
}
