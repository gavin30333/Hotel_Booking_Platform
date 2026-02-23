import { Request, Response } from 'express'
import { CustomerModel } from '../../schemas/customer.schema'
import { sendSmsCode, verifySmsCode } from '../utils/sms'
import { generateToken, AuthRequest } from '../middlewares/userAuth'

const PHONE_REGEX = /^1[3-9]\d{9}$/

export const userAuthController = {
  async sendCode(req: Request, res: Response) {
    try {
      const { phone } = req.body

      if (!phone || !PHONE_REGEX.test(phone)) {
        return res.status(400).json({
          success: false,
          message: '请输入正确的手机号',
          code: 'INVALID_PHONE',
        })
      }

      const result = await sendSmsCode(phone)

      if (result.success) {
        return res.json({
          success: true,
          message: '验证码发送成功',
          data: {
            code: result.code,
          },
        })
      }

      return res.status(500).json({
        success: false,
        message: '验证码发送失败',
      })
    } catch (error) {
      console.error('发送验证码错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { phone, code } = req.body

      if (!phone || !PHONE_REGEX.test(phone)) {
        return res.status(400).json({
          success: false,
          message: '请输入正确的手机号',
          code: 'INVALID_PHONE',
        })
      }

      if (!code || code.length !== 6) {
        return res.status(400).json({
          success: false,
          message: '请输入6位验证码',
          code: 'INVALID_CODE',
        })
      }

      if (!verifySmsCode(phone, code)) {
        return res.status(400).json({
          success: false,
          message: '验证码错误或已过期',
          code: 'INVALID_CODE',
        })
      }

      let customer = await CustomerModel.findOne({ phone })
      let isNewUser = false

      if (!customer) {
        customer = await CustomerModel.create({
          phone,
          nickname: `用户${phone.slice(-4)}`,
          favorites: [],
        })
        isNewUser = true
      }

      const token = generateToken(customer._id.toString(), customer.phone)

      return res.json({
        success: true,
        message: isNewUser ? '注册成功' : '登录成功',
        data: {
          user: {
            id: customer._id,
            phone: customer.phone,
            nickname: customer.nickname,
            avatar: customer.avatar,
          },
          token,
          isNewUser,
        },
      })
    } catch (error) {
      console.error('登录错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      const customer = await CustomerModel.findById(customerId)

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          code: 'USER_NOT_FOUND',
        })
      }

      return res.json({
        success: true,
        data: {
          id: customer._id,
          phone: customer.phone,
          nickname: customer.nickname,
          avatar: customer.avatar,
          createdAt: customer.createdAt,
        },
      })
    } catch (error) {
      console.error('获取用户信息错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const customerId = req.customer?.customerId
      const { nickname, avatar } = req.body

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: '未登录',
          code: 'UNAUTHORIZED',
        })
      }

      const updateData: { nickname?: string; avatar?: string } = {}
      if (nickname) updateData.nickname = nickname
      if (avatar) updateData.avatar = avatar

      const customer = await CustomerModel.findByIdAndUpdate(
        customerId,
        { $set: updateData },
        { new: true }
      )

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          code: 'USER_NOT_FOUND',
        })
      }

      return res.json({
        success: true,
        message: '更新成功',
        data: {
          id: customer._id,
          phone: customer.phone,
          nickname: customer.nickname,
          avatar: customer.avatar,
        },
      })
    } catch (error) {
      console.error('更新用户信息错误:', error)
      return res.status(500).json({
        success: false,
        message: '服务器错误',
      })
    }
  },
}

export default userAuthController
