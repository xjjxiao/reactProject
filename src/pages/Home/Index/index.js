import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile'
import axios from 'axios'
import nav1 from 'assets/images/nav-1.png'
import nav2 from 'assets/images/nav-2.png'
import nav3 from 'assets/images/nav-3.png'
import nav4 from 'assets/images/nav-4.png'
import './index.scss'
import { getCurrentCity } from 'utils/city'
const navList = [
  {
    title: '整租',
    path: '/home/house',
    icon: nav1,
  },
  {
    title: '合租',
    path: '/home/house',
    icon: nav2,
  },
  {
    title: '地图找房',
    path: '/map',
    icon: nav3,
  },
  {
    title: '去出租',
    path: '/rent',
    icon: nav4,
  },
]
class Index extends React.Component {
  state = {
    // data: ['1', '2', '3'],
    //不同屏幕会有一些抖动，刚加载的时候按比例算出高度
    imgHeight: (212 / 375) * window.innerWidth,
    swiperList: [],
    currentCity: {
      label: '北京',
      value: '',
    },
    groups: [],
    news: [],
  }
  async componentDidMount() {
    // 轮播图数据
    this.getSwipers()

    // 获取当前城市
    const city = await getCurrentCity()
    this.setState(
      {
        currentCity: city,
      },
      // 因为setState是异步的所以需要等城市信息更新后调用其他需要用到城市信息的接口，setState的回调
      () => {
        // 租房小组数据
        this.getGroups()
        // 咨询数据
        this.getNews()
      }
    )
    console.log(city, '获取到的城市信息', this.state.currentCity)
  }
  // 获取轮播图数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        swiperList: body,
      })
    }
  }
  // 获取当前城市

  // 获取租房小组
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: this.state.currentCity.value,
      },
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        groups: body,
      })
      // console.log(body)
    }
  }
  // 获取咨询数据
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: this.state.currentCity.value,
      },
    })
    const { status, body } = res.data
    // console.log('咨询', body)
    if (status === 200) {
      this.setState({
        news: body,
      })
    }
    // console.log('添加', this.state.news)
  }

  // 渲染轮播图
  renderSwiper() {
    // 判断为了页面刚进来没有渲染导致自动播放功能失效
    if (this.state.swiperList.length > 0) {
      return (
        <Carousel autoplay infinite>
          {this.state.swiperList.map((val) => (
            <a
              key={val.id}
              href="http://www.alipay.com"
              style={{
                display: 'inline-block',
                width: '100%',
                height: this.state.imgHeight,
              }}
            >
              <img
                src={`http://localhost:8080${val.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  // 触发window的resize事件
                  window.dispatchEvent(new Event('resize'))
                  // 当图片加载完成后动态设置轮播图的高度
                  this.setState({ imgHeight: 'auto' })
                }}
              />
            </a>
          ))}
        </Carousel>
      )
    } else {
      return null
    }
  }
  // 渲染导航
  renderNav() {
    return (
      <Flex>
        {navList.map((item) => (
          <Flex.Item
            key={item.title}
            onClick={() => {
              this.props.history.push(item.path)
            }}
          >
            <img src={item.icon} alt="" />
            <p>{item.title}</p>
          </Flex.Item>
        ))}
      </Flex>
    )
  }
  // 租房小组渲染
  renderGroups() {
    return (
      <>
        <h3 className="groups-title">
          租房小组
          <span className="more">更多</span>
        </h3>
        <Grid
          data={this.state.groups}
          columnNum={2}
          square={false}
          hasLine={false}
          renderItem={(item) => (
            <Flex className="group-item" justify="around">
              {/* {JSON.stringify(item)} */}
              <div className="info">
                <span className="title">{item.title}</span>
                <span className="desc">{item.desc}</span>
              </div>
              <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
      </>
    )
  }
  // 咨询渲染
  renderNews() {
    return (
      <>
        <h3 className="news-title">最新资讯</h3>
        {this.state.news.map((item) => (
          <div key={item.title} className="news-item">
            <div className="imgwrap">
              <img
                className="img"
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
              ></img>
            </div>
            <Flex className="content" justify="between" direction="column">
              {/* <Flex> */}
              <div className="title">{item.title} </div>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
              {/* </Flex> */}
            </Flex>
          </div>
        ))}
      </>
    )
  }
  // 搜索功能
  renderSearch() {
    return (
      <Flex className="search-box">
        <Flex className="search-from">
          <div
            className="location"
            onClick={() => {
              this.props.history.push('/city')
            }}
          >
            <span className="name">{this.state.currentCity.label}</span>
            <span className="iconfont icon-arrow"></span>
          </div>
          <div className="search-input">
            <span className="iconfont icon-seach" />
            <span className="text">请输入小区地址</span>
          </div>
        </Flex>
        {/* 地图小图标 */}
        <span
          className="iconfont icon-map"
          onClick={() => {
            this.props.history.push('/map')
          }}
        />
      </Flex>
    )
  }
  render() {
    return (
      // autoplay 是否自动播放
      // infinite 是否循环播放
      // beforeChange 切换面板前的回调函数 从第几张去第几张（索引）
      // afterChange 到达第几张（索引）
      <div className="index">
        <div className="carousel" style={{ height: this.state.imgHeight }}>
          {this.renderSwiper()}
          {this.renderSearch()}
        </div>
        <div className="nav">{this.renderNav()}</div>
        <div className="groups">{this.renderGroups()}</div>
        <div className="news">{this.renderNews()}</div>
      </div>
    )
  }
}
export default Index
