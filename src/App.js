import React from 'react'
// import { Button } from 'antd-mobile'
import { BrowserRouter as Router, Route,Redirect} from 'react-router-dom'
// 导入首页和城市选择两个组件的页面
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import Registe from './pages/Registe'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
import Favorate from './pages/Favorate'
// 房源发布
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'
import AuthRoute from './components/AuthRoute'
function App() {
  return (
    <Router>
      <div className="App">
       <Route path="/" exact render={() => <Redirect to="/home"/>}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/detail/:id" component={HouseDetail}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/registe" component={Registe}></Route>
        <AuthRoute path="/favorate" component={Favorate}></AuthRoute>
        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={RentAdd} />
        <AuthRoute path="/rent/search" component={RentSearch} />
      </div>
    </Router>
  )
}
export default App