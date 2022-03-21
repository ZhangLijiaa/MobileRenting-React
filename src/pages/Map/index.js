import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'
const BMap = window.BMap
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}
export default class Map extends React.Component {
  state = {
    housesList: [],
    isShowList: false
  }
  componentDidMount() {
    this.initMap()
  }

  initMap() {
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const map = new BMap.Map('container')
    this.map = map  
    const myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      label,
      async point => {
        if (point) {
          map.centerAndZoom(point, 11)
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())
          this.renderOverlays(value)
        }
      },
      label
    )
    map.addEventListener('movestart', () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }
  async renderOverlays(id) {
    try {
      Toast.loading('正在加载中...', 0, null, false)
      const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
      Toast.hide()
      const data = res.data.body
      const { nextZoom, type } = this.getTypeAndZoom()
      data.forEach(item => {
        this.createOverlays(item, nextZoom, type)
      })
    }catch(e){
      Toast.hide()
    }
  }
  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    let nextZoom, type
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      type = 'rect'
    }
    return {
      nextZoom,
      type
    }
  }
  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = data
    const areaPoint = new BMap.Point(longitude, latitude)
    if (type === 'circle') {
      this.createCircle(areaPoint, areaName, count, value, zoom)
    } else {
      this.createRect(areaPoint, areaName, count, value)
    }
  }
  createCircle(point, name, count, id, zoom) {
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(-35, -35)
    })
    label.id = id
    label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
    `)
    label.setStyle(labelStyle)
    label.addEventListener('click', () => {
      this.renderOverlays(id)
      this.map.centerAndZoom(point, zoom)
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
    })
    this.map.addOverlay(label)
  }
  createRect(point, name, count, id) {
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(-50, -28)
    })
    label.id = id
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)
    label.setStyle(labelStyle)
    label.addEventListener('click', e => {
      this.getHousesList(id)
      const target = e.changedTouches[0]
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      )
    })
    this.map.addOverlay(label)
  }
  async getHousesList(id) {
    try {
      Toast.loading('正在加载中...', 0, null, false)
      const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
      Toast.hide()
      this.setState({
        housesList: res.data.body.list,
        isShowList: true
      })
    }catch(e) {
      Toast.hide()
    }
  }

  renderHousesList() {
    return this.state.housesList.map(item => (
      <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`http://localhost:8080${item.houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {item.tags.map((tag, index) => {
              const tagClass = 'tag' + (index + 1)
              return (
                <span
                  className={[styles.tag, styles[tagClass]].join(' ')}
                  key={tag}
                >
                  {tag}
                </span>
              )
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
  }

  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container} />
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ''
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>
          <div className={styles.houseItems}>
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    )
  }
}
