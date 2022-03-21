import React from "react";
import { API } from '../../utils/api';
import { Toast } from 'antd-mobile';
import { List, AutoSizer  } from 'react-virtualized';
import './index.css'
import { getCurrentCity } from '../../utils'
import NavHeader from '../../components/NavHeader/index'
const formatCityData= (list)=>{
        const cityList={};
       list.forEach(item => {
        const first=item.short.substr(0,1)
        if(cityList[first]){
            cityList[first].push(item)
        }else{
            cityList[first]=[item]
        }
    })
    const cityIndex = Object.keys(cityList).sort()
    return{
        cityList,
        cityIndex,
    }
}
const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50
const formatCityIndex = (letterIndex) => {
    switch (letterIndex) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letterIndex.toUpperCase()
    }
}
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
export default class CityList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            cityList:{},
            cityIndex:[],
            activeIndex:0
        }
        this.cityListComponent = React.createRef()
    }
    async componentDidMount(){
       await this.getCityList()
        this.cityListComponent.current.measureAllRows()
    }
    async getCityList(){
        const res = await API.get(`/area/city?level=1`)
        const{cityList,cityIndex}= formatCityData(res.data.body)
        const resHot= await API.get('/area/hot')
        cityList['hot'] = resHot.data.body
        cityIndex.unshift('hot')
        const curCity = await getCurrentCity()
        cityList['#']=[curCity]
        cityIndex.unshift('#')
        this.setState({
            cityList,
            cityIndex
        })
    }
    changeCity ({ label, value }){
        if(HOUSE_CITY.indexOf(label) > -1){
            localStorage.setItem('hkzf_city',JSON.stringify({ label,value }))
            this.props.history.go(-1)
        }else{
            Toast.info('该城市暂无房源数据', 2, null, false);
        }
    }
    rowRenderer = ({
        index,
        isScrolling, 
        isVisible, 
        key, 
        style, 
    }) => {
       const { cityIndex,cityList } =this.state
       const letterIndex = cityIndex[index]
        return (
        <div key={key} style={style} className='city'>
                <div className='title'>{formatCityIndex(letterIndex)}</div>
                {
                    cityList[letterIndex].map(item => 
                    <div className='name' key={item.value} onClick={ () => this.changeCity(item)}>{item.label}</div>)
                }
        </div>
        )
    }
    getRowHeight = ({index}) => {
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }
    renderCityIndex() {
       return this.state.cityIndex.map((item,index) =>
         <li className='city-index-item' key={item}
         onClick={() => {
             this.cityListComponent.current.scrollToRow(index)
         }}>
            <span className={this.state.activeIndex===index?'index-active':''}>
                {item==='hot'?'热':item.toUpperCase()}
            </span>
        </li>)
    }
    onRowsRendered = ({startIndex}) => {
        if(this.state.activeIndex!==startIndex){
            this.setState({
                activeIndex:startIndex
            })
        }
    }
    render() {
        return (
            <div className="citylist"> 
                <NavHeader>城市选择</NavHeader>
                <AutoSizer>
                    {({width, height}) => (
                    <List
                        ref={this.cityListComponent}
                        width={width}
                        height={height}
                        rowCount={this.state.cityIndex.length}
                        rowHeight={this.getRowHeight}
                        rowRenderer={this.rowRenderer}
                        onRowsRendered={this.onRowsRendered}
                        scrollToAlignment='start'
                        />
                    )}
                </AutoSizer>
                <ul className='city-index'>
                   {this.renderCityIndex() }
                </ul>
            </div>
        )
    }
}