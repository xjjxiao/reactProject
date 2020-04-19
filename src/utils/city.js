import axios from 'axios'
// 本地缓存中取当前城市信息返回城市信息，
// 若无信息，通过地图定位当前城市
// 发送请求获取当前城市数据，存入本地并返回
const CURRENT_CITY = 'currentCity'

export function getCurrentCity() {
    return new Promise((resolve, reject) => {

        let city = JSON.parse(localStorage.getItem(CURRENT_CITY))
        if (city) {
            resolve(city)
        } else {
            const myCity = new window.BMap.LocalCity()
            myCity.get((result) => {
                // console.log('当前城市', result)
                axios.get('http://localhost:8080/area/info', {
                        params: {
                            name: result.name
                        }
                    })
                    .then(res => {
                        const {
                            status,
                            body
                        } = res.data
                        if (status === 200) {
                            localStorage.setItem(CURRENT_CITY, JSON.stringify(body))
                            resolve(body)
                        }
                    }).catch(err => {
                        reject(err)
                    })

                // console.log('城市信息', res)
            })
        }
    })

}