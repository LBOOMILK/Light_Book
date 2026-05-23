import axios from 'axios'
import config from '../config'
import router from '../router'
import { showLoadingToast, showToast, closeToast } from 'vant'

const service = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout
})

service.interceptors.request.use(
  (config) => {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true
    })
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    closeToast()
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    closeToast()
    const { code, data, message } = response.data
    
    if (code === 0) {
      if (message) {
        showToast({ message, type: 'success' })
      }
      return data
    }
    
    showToast({ message: message || '操作失败', type: 'error' })
    
    if (code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
    
    return Promise.reject(new Error(message))
  },
  (error) => {
    closeToast()
    showToast({ message: '网络请求失败', type: 'error' })
    return Promise.reject(error)
  }
)

export default service