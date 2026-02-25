export default defineAppConfig({
  pages: [
    'pages/search/index',
    'pages/list/index',
    'pages/detail/index',
    'pages/booking/index',
    'pages/login/index',
    'pages/map/index',
    'pages/favorite/index',
    'pages/profile/index',
    'pages/order/index',
    'pages/error/404',
    'pages/error/403',
    'pages/error/500',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '酒店预订',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f5f5',
  },
  networkTimeout: {
    request: 15000,
    downloadFile: 30000,
  },
  debug: process.env.NODE_ENV === 'development',
})
