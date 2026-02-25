import Taro from '@tarojs/taro'

export interface RouteConfig {
  path: string
  requiresAuth?: boolean
  roles?: string[]
}

export const AUTH_REQUIRED_PAGES: string[] = [
  '/pages/booking/index',
  '/pages/order/index',
  '/pages/profile/index',
  '/pages/favorite/index',
]

export const PUBLIC_PAGES: string[] = [
  '/pages/search/index',
  '/pages/list/index',
  '/pages/detail/index',
  '/pages/login/index',
  '/pages/error/404',
  '/pages/error/403',
  '/pages/error/500',
]

export const TAB_PAGES: string[] = [
  '/pages/search/index',
  '/pages/favorite/index',
  '/pages/order/index',
  '/pages/profile/index',
]

export function checkAuth(): boolean {
  const isLoggedIn = Taro.getStorageSync('isLoggedIn')
  const token = Taro.getStorageSync('token')
  return !!(isLoggedIn && token)
}

export function checkRouteAuth(path: string): boolean {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  const requiresAuth = AUTH_REQUIRED_PAGES.some(
    (page) =>
      normalizedPath === page ||
      normalizedPath.startsWith(page.replace('/index', ''))
  )

  if (!requiresAuth) {
    return true
  }

  return checkAuth()
}

export function navigateToLogin(fromPage?: string) {
  const currentPath = fromPage || Taro.getCurrentPages()[0]?.route || ''
  Taro.navigateTo({
    url: `/pages/login/index?fromPage=${encodeURIComponent(currentPath)}`,
  })
}

export function navigateTo404() {
  Taro.redirectTo({
    url: '/pages/error/404',
    fail: () => {
      Taro.reLaunch({ url: '/pages/error/404' })
    },
  })
}

export function navigateTo403() {
  Taro.redirectTo({
    url: '/pages/error/403',
    fail: () => {
      Taro.reLaunch({ url: '/pages/error/403' })
    },
  })
}

export function navigateTo500() {
  Taro.redirectTo({
    url: '/pages/error/500',
    fail: () => {
      Taro.reLaunch({ url: '/pages/error/500' })
    },
  })
}

export function withAuth<T extends (...args: any[]) => any>(
  fn: T,
  options?: { redirectToLogin?: boolean }
): T {
  return ((...args: Parameters<T>) => {
    if (!checkAuth()) {
      if (options?.redirectToLogin !== false) {
        navigateToLogin()
      }
      return
    }
    return fn(...args)
  }) as T
}

export function requireAuth() {
  if (!checkAuth()) {
    navigateToLogin()
    return false
  }
  return true
}
