import React from 'react'
import { Flex, Toast } from 'antd-mobile'
import { List,AutoSizer,WindowScroller,InfiniteLoader} from 'react-virtualized'
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'
import { getCurrentCity } from '../../utils'
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import NoHouse from '../../components/NoHouse'
import Sticky from '../../components/Sticky'
import './index.css'
import HouseItem from '../../components/HouseItem'
export default class HouseList extends React.Component{
    state = {
        list:[],
        count:0,
        isLoading: false
    }
    filters = {}
    async componentDidMount(){
        const { label, value } = await getCurrentCity()
        this.label = label
         this.value = value
        this.getHouseList()
    }
    async getHouseList(){
        try {
           this.setState({
                isLoading: true
            })
            Toast.loading('数据加载中...', 0, null, false)
            const res =await API.get('/houses',{
                params:{
                    cityId:this.value, 
                    ...this.filters,
                    start:1,  
                    end:20
                }
            })
            Toast.hide()
            const { list, count } = res.data.body
            if (count !== 0) {
              Toast.info(`共找到 ${count} 套房源`, 2, null, false)
            }
            this.setState({
                list, 
                count,
                isLoading: false
            })
        } catch (error) {
           Toast.hide()
        }
    }
    onFilter = (filters) => {
        window.scroll(0, 0) 
        this.filters = filters
        this.getHouseList()
    }
    renderHouseList = ({
        index, 
        key, 
        style, 
    }) => {
        const { list }= this.state
        const house = list[index]
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className='loading' />
        </div>
      )
    }
        return (
            <HouseItem 
            key={key} 
            onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
            style={style}
            src={BASE_URL + house.houseImg}
            title={house.title}
            desc={house.desc}
            tags={house.tags}
            price={house.price}
            />
        )
    }
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })
        resolve()
      })
    })
  }
  renderList() {
    const { count, isLoading } = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight
                    width={width}
                    height={height}
                    rowCount={count} 
                    rowHeight={120}
                    rowRenderer={this.renderHouseList}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
    render(){
            const { count, isLoading } = this.state
            if (count === 0 && !isLoading) {
        return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }
        return(
            <div>
                <Flex className="header">
                    <i className="iconfont icon-back" onClick={()=>this.props.history.go(-1)}></i>
                    <SearchHeader cityName={this.label}></SearchHeader>
                </Flex>
                <Sticky height={40}>
                    <Filter onFilter={this.onFilter}/>
                </Sticky>
                <div className='houseItmes'>
                    {this.renderList()}
                </div>
            </div>
        )
    }
}