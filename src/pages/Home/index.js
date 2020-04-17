import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { TabBar } from 'antd-mobile'

import House from './House'
import Index from './Index/index.js'
import News from './News'
import Profile from './Profile'
import NoMatch from '../NoMatch'
import './index.scss'

const tabs = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home',
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/house',
  },
  {
    title: '咨询',
    icon: 'icon-infom',
    path: '/home/news',
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile',
  },
]
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 默认选中的tab
      selectedTab: this.props.location.pathname,
    }
  }
  render() {
    return (
      <div className="home">
        <Switch>
          <Route exact path="/home" component={Index}></Route>
          <Route path="/home/house" component={House}></Route>
          <Route path="/home/news" component={News}></Route>
          <Route path="/home/Profile" component={Profile}></Route>
          <Route component={NoMatch}></Route>
        </Switch>
        <div className="tabBar">
          {/* 
            TabBar组件
            unselectedTintColor 没有选中的文字的颜色
            tintColor： 选中文字的颜色
            barTintColor: 整体的tabBar的背景色
            hidden： 用于控制整体tabBar是否渲染的
          */}
          <TabBar
            unselectedTintColor="#888888"
            tintColor="#21b97a"
            barTintColor="#fff"
            // hidden={this.state.hidden}
          >
            {/* 
              配置一个TabBar.Item
              title: 选项显示的文字
              key: 唯一，和title一致就行
              icon: 控制选项的图标
              selectedIcon: 选中的图标
              selected ： 控制当前tabBar是否选中
              badge： 徽章 角标
              onPress: 点击事件
            */}
            {tabs.map((item) => (
              <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<span className={`iconfont ${item.icon}`}></span>}
                selectedIcon={<span className={`iconfont ${item.icon}`}></span>}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                  this.props.history.push(item.path)
                }}
              >
                {/* {item.title}页面 */}
              </TabBar.Item>
            ))}

            {/* <TabBar.Item title="找房">找房页面</TabBar.Item>
          <TabBar.Item title="咨询">咨询页面</TabBar.Item>
          <TabBar.Item title="我的">我的页面</TabBar.Item> */}
          </TabBar>
        </div>
      </div>
    )
  }
  componentDidUpdate(prevProps) {
    console.log(prevProps)
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
  }
}

export default Home
