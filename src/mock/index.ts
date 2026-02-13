import Mock from 'mockjs'

// 模拟轮播图数据
type Banner = {
  id: number
  imgUrl: string
  title: string
}
type BannerResponse = {
  code: number
  msg: string
  data: Banner[]
}
export const getBanners = () => {
  const data = Mock.mock({
    'list|3-8': [
      {
        'id|+1': 1,
        // 使用 picsum 获取真实图片，添加随机参数避免缓存
        imgUrl: 'https://picsum.photos/750/350?random=@integer(1, 1000)',
        title: '@ctitle(4, 8)',
      },
    ],
  })
  return data.list
}
export type { Banner, BannerResponse }
