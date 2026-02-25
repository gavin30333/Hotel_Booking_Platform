import { CityHotSearchModel } from '../../schemas/cityHotSearch.schema'

export interface HotSearchResponse {
  city: string
  cityCode?: string
  hotTags: string[]
  rankingLists: Array<{
    title: string
    type: string
    items: Array<{
      hotelId?: string
      name: string
      rank: number
      score?: string
      price?: number
      description?: string
      imageUrl?: string
      tags?: string[]
    }>
  }>
}

export const hotSearchService = {
  async getHotSearchByCity(
    cityName: string
  ): Promise<HotSearchResponse | null> {
    const hotSearch = await CityHotSearchModel.findOne({
      city: cityName,
      isActive: true,
    }).lean()

    if (!hotSearch) {
      return null
    }

    return {
      city: hotSearch.city,
      cityCode: hotSearch.cityCode,
      hotTags: hotSearch.hotTags,
      rankingLists: hotSearch.rankingLists.map((list) => ({
        title: list.title,
        type: list.type,
        items: list.items.map((item) => ({
          hotelId: item.hotelId?.toString(),
          name: item.name,
          rank: item.rank,
          score: item.score,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          tags: item.tags,
        })),
      })),
    }
  },

  async getAllActiveCities(): Promise<
    Array<{ city: string; cityCode?: string; priority: number }>
  > {
    const cities = await CityHotSearchModel.find({ isActive: true })
      .select('city cityCode priority')
      .sort({ priority: 1 })
      .lean()

    return cities.map((c) => ({
      city: c.city,
      cityCode: c.cityCode,
      priority: c.priority,
    }))
  },

  async createHotSearch(data: {
    city: string
    cityCode?: string
    hotTags: string[]
    rankingLists: Array<{
      title: string
      type: string
      items: Array<{
        hotelId?: string
        name: string
        rank: number
        score?: string
        price?: number
        description?: string
        imageUrl?: string
        tags?: string[]
      }>
    }>
    priority?: number
  }) {
    const hotSearch = new CityHotSearchModel({
      city: data.city,
      cityCode: data.cityCode,
      hotTags: data.hotTags,
      rankingLists: data.rankingLists,
      priority: data.priority || 0,
      isActive: true,
    })

    return await hotSearch.save()
  },

  async updateHotSearch(
    cityName: string,
    data: Partial<{
      hotTags: string[]
      rankingLists: Array<{
        title: string
        type: string
        items: Array<{
          hotelId?: string
          name: string
          rank: number
          score?: string
          price?: number
          description?: string
          imageUrl?: string
          tags?: string[]
        }>
      }>
      isActive: boolean
      priority: number
    }>
  ) {
    return await CityHotSearchModel.findOneAndUpdate({ city: cityName }, data, {
      new: true,
    })
  },

  async deleteHotSearch(cityName: string) {
    return await CityHotSearchModel.findOneAndDelete({ city: cityName })
  },
}
