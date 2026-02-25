import { View, Text, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Dialog } from 'antd-mobile'
import {
  UserOutline,
  ScanCodeOutline,
  CheckCircleOutline,
  MessageOutline,
  SetOutline,
  ShopbagOutline,
  ClockCircleOutline,
  ReceivePaymentOutline,
  MessageOutline as ChatOutline,
  FileOutline as FileOutlineIcon,
  CollectMoneyOutline,
  CouponOutline,
  GiftOutline,
} from 'antd-mobile-icons'
import Taro, { showToast } from '@tarojs/taro'
import BottomTabBar from '@/components/common/navigation/BottomTabBar/BottomTabBar'
import './index.less'

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'

export default function ProfilePage() {
  console.log('Profile page loaded')
  const [userInfo, setUserInfo] = useState({
    name: '旅行达人',
    phone: '',
    avatar: DEFAULT_AVATAR,
  })
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  useEffect(() => {
    const storedUserInfo = Taro.getStorageSync('userInfo')
    const loggedIn = Taro.getStorageSync('isLoggedIn')

    if (loggedIn && storedUserInfo) {
      setIsLoggedIn(true)
      setUserInfo({
        name: storedUserInfo.name || storedUserInfo.nickname || '旅行达人',
        phone: storedUserInfo.phone || '',
        avatar: storedUserInfo.avatar || DEFAULT_AVATAR,
      })
    }
  }, [])

  const handleLogin = () => {
    Taro.navigateTo({
      url: '/pages/login/index',
    })
  }

  const handleLogout = () => {
    Dialog.confirm({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
    })
      .then(() => {
        Taro.removeStorageSync('isLoggedIn')
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('userInfo')

        setIsLoggedIn(false)
        setUserInfo({
          name: '未登录',
          phone: '',
          avatar: DEFAULT_AVATAR,
        })

        showToast({
          title: '退出登录成功',
          icon: 'success',
        })
      })
      .catch(() => {})
  }

  return (
    <>
      <View className="profile-page">
        <View className="top-actions">
          <View className="action-icon" onClick={() => console.log('扫一扫')}>
            <ScanCodeOutline />
          </View>
          <View className="action-icon" onClick={() => console.log('签到')}>
            <CheckCircleOutline />
          </View>
          <View className="action-icon" onClick={() => console.log('客服')}>
            <MessageOutline />
          </View>
          <View className="action-icon" onClick={() => console.log('设置')}>
            <SetOutline />
          </View>
        </View>

        <View className="user-info-section">
          <View className="user-avatar">
            <Image
              src={userInfo.avatar || DEFAULT_AVATAR}
              className="avatar-img"
              mode="aspectFill"
            />
          </View>
          <View className="user-info">
            <Text className="user-name">{userInfo.name}</Text>
            <Text className="user-stats">粉丝 128 关注 56 赞 89 费过 32</Text>
          </View>
          <View
            className="home-link"
            onClick={() => Taro.reLaunch({ url: '/pages/search/index' })}
          >
            <Text>主页 ＞</Text>
          </View>
        </View>

        <View className="membership-section">
          <View className="membership-info">
            <View className="membership-badge">
              <Text>黄金会员</Text>
            </View>
            <View
              className="membership-center"
              onClick={() => console.log('会员中心')}
            >
              <Text>会员中心 ＞</Text>
            </View>
          </View>
          <View className="points-info" onClick={() => console.log('携程积分')}>
            <Text>携程积分</Text>
            <Text className="points-value">积分抵¥30</Text>
          </View>
        </View>

        <View className="benefits-section">
          <View className="benefit-item">
            <CollectMoneyOutline className="benefit-icon" />
            <Text className="benefit-title">积分抵现</Text>
            <Text className="benefit-desc">抵用现金</Text>
          </View>
          <View className="benefit-item">
            <CouponOutline className="benefit-icon" />
            <Text className="benefit-title">机场餐饮</Text>
            <Text className="benefit-desc">8折优惠</Text>
          </View>
          <View className="benefit-item">
            <GiftOutline className="benefit-icon" />
            <Text className="benefit-title">优享会员</Text>
            <Text className="benefit-desc">酒店折扣</Text>
          </View>
        </View>

        <View className="stats-section">
          <View className="stat-item">
            <Text className="stat-value">1</Text>
            <Text className="stat-label">收藏</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">13</Text>
            <Text className="stat-label">浏览历史</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">1280</Text>
            <Text className="stat-label">积分</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">3</Text>
            <Text className="stat-label">优惠券</Text>
          </View>
        </View>

        <View className="order-entries-section">
          <View className="order-entry" onClick={() => console.log('待付款')}>
            <ShopbagOutline />
            <Text>待付款</Text>
          </View>
          <View className="order-entry" onClick={() => console.log('待出行')}>
            <ClockCircleOutline />
            <Text>待出行</Text>
          </View>
          <View
            className="order-entry"
            onClick={() => console.log('退款/售后')}
          >
            <ReceivePaymentOutline />
            <Text>退款/售后</Text>
          </View>
          <View className="order-entry" onClick={() => console.log('待点评')}>
            <ChatOutline />
            <Text>待点评</Text>
          </View>
          <View
            className="order-entry"
            onClick={() => Taro.redirectTo({ url: '/pages/order/index' })}
          >
            <FileOutlineIcon />
            <Text>全部订单</Text>
          </View>
        </View>

        <View className="auth-buttons">
          {isLoggedIn ? (
            <View className="logout-btn" onClick={handleLogout}>
              <Text>退出登录</Text>
            </View>
          ) : (
            <View className="login-btn" onClick={handleLogin}>
              <Text>点击登录</Text>
            </View>
          )}
        </View>
      </View>

      <BottomTabBar activeKey="profile" />
    </>
  )
}
