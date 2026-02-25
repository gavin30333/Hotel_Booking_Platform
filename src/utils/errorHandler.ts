import Taro from '@tarojs/taro'
import { navigateTo404, navigateTo403, navigateTo500 } from './routeGuard'

export interface AppError {
  code: number
  message: string
  details?: any
}

export type ErrorType =
  | 'network'
  | 'auth'
  | 'notFound'
  | 'forbidden'
  | 'server'
  | 'unknown'

export function classifyError(error: any): ErrorType {
  if (!error) return 'unknown'

  if (
    error.errMsg?.includes('request:fail') ||
    error.message?.includes('network')
  ) {
    return 'network'
  }

  const statusCode = error.statusCode || error.status || error.code

  if (statusCode === 401 || statusCode === 403) {
    return 'auth'
  }

  if (statusCode === 404) {
    return 'notFound'
  }

  if (statusCode === 403) {
    return 'forbidden'
  }

  if (statusCode >= 500) {
    return 'server'
  }

  return 'unknown'
}

export function getErrorMessage(error: any): string {
  const type = classifyError(error)

  const messages: Record<ErrorType, string> = {
    network: '网络连接失败，请检查网络设置',
    auth: '登录已过期，请重新登录',
    notFound: '请求的资源不存在',
    forbidden: '没有权限访问此资源',
    server: '服务器错误，请稍后重试',
    unknown: '发生未知错误，请稍后重试',
  }

  return error?.message || error?.errMsg || messages[type]
}

export function handleError(
  error: any,
  options?: {
    showToast?: boolean
    navigate?: boolean
  }
): void {
  const { showToast = true, navigate = false } = options || {}
  const type = classifyError(error)
  const message = getErrorMessage(error)

  console.error('[ErrorHandler]', error)

  if (showToast) {
    Taro.showToast({
      title: message,
      icon: 'none',
      duration: 2000,
    })
  }

  if (navigate) {
    switch (type) {
      case 'notFound':
        navigateTo404()
        break
      case 'forbidden':
        navigateTo403()
        break
      case 'server':
        navigateTo500()
        break
      case 'auth':
        Taro.removeStorageSync('isLoggedIn')
        Taro.removeStorageSync('token')
        Taro.navigateTo({ url: '/pages/login/index' })
        break
    }
  }
}

export function createAppError(
  code: number,
  message: string,
  details?: any
): AppError {
  return { code, message, details }
}

export function isAppError(error: any): error is AppError {
  return (
    error && typeof error.code === 'number' && typeof error.message === 'string'
  )
}

export function wrapAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: { showToast?: boolean; navigate?: boolean }
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, options)
      throw error
    }
  }) as T
}

export function safeExecute<T>(
  fn: () => T,
  fallback?: T,
  options?: { showToast?: boolean }
): T | undefined {
  try {
    return fn()
  } catch (error) {
    handleError(error, {
      showToast: options?.showToast ?? true,
      navigate: false,
    })
    return fallback
  }
}

export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T,
  options?: { showToast?: boolean }
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    handleError(error, {
      showToast: options?.showToast ?? true,
      navigate: false,
    })
    return fallback
  }
}
