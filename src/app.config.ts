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
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/search/index',
        text: '首页',
      },
      {
        pagePath: 'pages/favorite/index',
        text: '收藏',
      },
      {
        pagePath: 'pages/order/index',
        text: '订单',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
      },
    ],
  },
})
