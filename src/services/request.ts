import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'development' 
  ? process.env.REACT_APP_API_BASE_URL 
  : process.env.REACT_APP_API_BASE_URL

const service = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

service.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      console.error('Response error:', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default service