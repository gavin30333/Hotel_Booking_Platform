import { Request, Response } from 'express'
import { hotSearchService } from '../services/hotSearch.service'

export const hotSearchController = {
  async getHotSearchByCity(req: Request, res: Response) {
    try {
      const { city } = req.params

      if (!city) {
        return res.status(400).json({
          code: 400,
          msg: '城市参数不能为空',
          data: null,
        })
      }

      const decodedCity = decodeURIComponent(city)
      const hotSearchData = await hotSearchService.getHotSearchByCity(decodedCity)

      if (!hotSearchData) {
        return res.status(404).json({
          code: 404,
          msg: `未找到城市「${decodedCity}」的热搜数据`,
          data: null,
        })
      }

      res.status(200).json({
        code: 200,
        msg: '查询成功',
        data: hotSearchData,
      })
    } catch (error) {
      console.error('Get hot search by city error:', error)
      res.status(500).json({
        code: 500,
        msg: '服务器内部错误',
        data: null,
      })
    }
  },

  async getAllActiveCities(req: Request, res: Response) {
    try {
      const cities = await hotSearchService.getAllActiveCities()

      res.status(200).json({
        code: 200,
        msg: '查询成功',
        data: cities,
      })
    } catch (error) {
      console.error('Get all active cities error:', error)
      res.status(500).json({
        code: 500,
        msg: '服务器内部错误',
        data: null,
      })
    }
  },

  async createHotSearch(req: Request, res: Response) {
    try {
      const { city, cityCode, hotTags, rankingLists, priority } = req.body

      if (!city || !hotTags || !rankingLists) {
        return res.status(400).json({
          code: 400,
          msg: '缺少必要参数：city, hotTags, rankingLists',
          data: null,
        })
      }

      const result = await hotSearchService.createHotSearch({
        city,
        cityCode,
        hotTags,
        rankingLists,
        priority,
      })

      res.status(201).json({
        code: 201,
        msg: '创建成功',
        data: result,
      })
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(409).json({
          code: 409,
          msg: '该城市的热搜数据已存在',
          data: null,
        })
      }
      console.error('Create hot search error:', error)
      res.status(500).json({
        code: 500,
        msg: '服务器内部错误',
        data: null,
      })
    }
  },

  async updateHotSearch(req: Request, res: Response) {
    try {
      const { city } = req.params
      const updateData = req.body

      if (!city) {
        return res.status(400).json({
          code: 400,
          msg: '城市参数不能为空',
          data: null,
        })
      }

      const decodedCity = decodeURIComponent(city)
      const result = await hotSearchService.updateHotSearch(decodedCity, updateData)

      if (!result) {
        return res.status(404).json({
          code: 404,
          msg: `未找到城市「${decodedCity}」的热搜数据`,
          data: null,
        })
      }

      res.status(200).json({
        code: 200,
        msg: '更新成功',
        data: result,
      })
    } catch (error) {
      console.error('Update hot search error:', error)
      res.status(500).json({
        code: 500,
        msg: '服务器内部错误',
        data: null,
      })
    }
  },

  async deleteHotSearch(req: Request, res: Response) {
    try {
      const { city } = req.params

      if (!city) {
        return res.status(400).json({
          code: 400,
          msg: '城市参数不能为空',
          data: null,
        })
      }

      const decodedCity = decodeURIComponent(city)
      const result = await hotSearchService.deleteHotSearch(decodedCity)

      if (!result) {
        return res.status(404).json({
          code: 404,
          msg: `未找到城市「${decodedCity}」的热搜数据`,
          data: null,
        })
      }

      res.status(200).json({
        code: 200,
        msg: '删除成功',
        data: null,
      })
    } catch (error) {
      console.error('Delete hot search error:', error)
      res.status(500).json({
        code: 500,
        msg: '服务器内部错误',
        data: null,
      })
    }
  },
}
