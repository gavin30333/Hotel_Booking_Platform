import Taro from '@tarojs/taro'
import { handleError, classifyError } from '@/utils/errorHandler'
import { navigateToLogin } from '@/utils/routeGuard'

const BASE_URL =
  process.env.TARO_APP_API_BASE_URL || 'http://localhost:3000/api'

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  header?: Record<string, string>
  showLoading?: boolean
  showError?: boolean
  requireAuth?: boolean
}

interface ResponseData<T = any> {
  code: number
  data: T
  message: string
}

async function request<T = any>(config: RequestConfig): Promise<T> {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    showLoading = false,
    showError = true,
    requireAuth = false,
  } = config

  if (showLoading) {
    Taro.showLoading({ title: '加载中...', mask: true })
  }

  try {
    const token = Taro.getStorageSync('token')
    const isLoggedIn = Taro.getStorageSync('isLoggedIn')

    if (requireAuth && (!token || !isLoggedIn)) {
      navigateToLogin()
      throw new Error('请先登录')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...header,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: headers,
      timeout: 15000,
    })

    if (showLoading) {
      Taro.hideLoading()
    }

    const statusCode = response.statusCode
    const resData = response.data as ResponseData<T>

    if (statusCode === 401) {
      Taro.removeStorageSync('isLoggedIn')
      Taro.removeStorageSync('token')
      navigateToLogin()
      throw new Error('登录已过期，请重新登录')
    }

    if (statusCode === 403) {
      throw new Error('没有权限访问此资源')
    }

    if (statusCode === 404) {
      throw new Error('请求的资源不存在')
    }

    if (statusCode >= 500) {
      throw new Error('服务器错误，请稍后重试')
    }

    if (resData.code !== 200 && resData.code !== 0) {
      throw new Error(resData.message || '请求失败')
    }

    return resData.data
  } catch (error: any) {
    if (showLoading) {
      Taro.hideLoading()
    }

    console.error('[Request Error]', error)

    if (showError) {
      handleError(error, { showToast: true, navigate: false })
    }

    throw error
  }
}

export function get<T = any>(
  url: string,
  params?: any,
  config?: Omit<RequestConfig, 'url' | 'method'>
): Promise<T> {
  const queryString = params
    ? '?' +
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : ''
  return request<T>({ ...config, url: url + queryString, method: 'GET' })
}

export function post<T = any>(
  url: string,
  data?: any,
  config?: Omit<RequestConfig, 'url' | 'method'>
): Promise<T> {
  return request<T>({ ...config, url, method: 'POST', data })
}

export function put<T = any>(
  url: string,
  data?: any,
  config?: Omit<RequestConfig, 'url' | 'method'>
): Promise<T> {
  return request<T>({ ...config, url, method: 'PUT', data })
}

export function del<T = any>(
  url: string,
  data?: any,
  config?: Omit<RequestConfig, 'url' | 'method'>
): Promise<T> {
  return request<T>({ ...config, url, method: 'DELETE', data })
}

export default request
