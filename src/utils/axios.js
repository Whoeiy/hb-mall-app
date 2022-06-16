
import axios from 'axios'
import { Toast } from 'vant'
import { setLocal } from '@/common/js/utils'
import router from '../router'

// axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? 'http://101.133.131.175:8080/' : 'http://101.133.131.175:8080/'
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '/api' : '/api'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localStorage.getItem('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.fail('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.message) Toast.fail(res.data.message)
    if (res.data.code == 416) {
      router.push({ path: '/login' })
    }
    if (res.data.data && window.location.hash == '#/login') {
      setLocal('token', res.data.data)
      axios.defaults.headers['token'] = res.data.data
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios
