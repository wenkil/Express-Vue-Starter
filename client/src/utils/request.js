import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router/index'
// import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/json'
    config.headers['Authorization'] = sessionStorage.token
    //localStorage.token
    // if (config.method == 'post') {
    //   config.data = qs.stringify(config.data)
    // }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // console.log('response------->', response)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code == -10) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 3000
      })
      localStorage.clear()
      sessionStorage.clear()
      setTimeout(function() {
        router.push('/login')
      }, 500)
    } else {
      return res
    }
    return {}
  },
  error => {
    if (error.response) {
      let details = error.response.data.details
      if(details){
        let mes = error.response.config.method == 'post' ? details.body[0].message : details.query[0].message
        Message({
          message: '错误码：【' + error.response.status + '】 '+ mes,
          type: 'error',
          duration: 3000
        })
      }
      else{
        Message({
          message: `错误码：【${error.response.status}】 '  ${error.response.config.url}`,
          type: 'error',
          duration: 3000
        })
      }
    } else {
      Message({
        message: error.msg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error);
  }
)
export default service
