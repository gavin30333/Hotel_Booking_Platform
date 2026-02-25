import { View, Text } from '@tarojs/components'
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

export default function ProfilePage() {
  console.log('Profile page loaded')
  const [userInfo, setUserInfo] = useState({
    name: '未登录',
    phone: '',
    avatar: '',
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // 从本地存储获取用户信息
    const storedUserInfo = Taro.getStorageSync('userInfo')
    const loggedIn = Taro.getStorageSync('isLoggedIn')

    if (loggedIn && storedUserInfo) {
      setIsLoggedIn(true)
      setUserInfo({
        name: storedUserInfo.name || storedUserInfo.nickname || '用户',
        phone: storedUserInfo.phone || '',
        avatar: storedUserInfo.avatar || '',
      })
    }
  }, [])

  // 登录处理
  const handleLogin = () => {
    Taro.navigateTo({
      url: '/pages/login/index',
    })
  }

  // 退出登录处理
  const handleLogout = () => {
    Dialog.confirm({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
    })
      .then(() => {
        // 清除本地存储的用户信息
        Taro.removeStorageSync('isLoggedIn')
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('userInfo')

        // 更新状态
        setIsLoggedIn(false)
        setUserInfo({
          name: '未登录',
          phone: '',
          avatar: '',
        })

        showToast({
          title: '退出登录成功',
          icon: 'success',
        })
      })
      .catch(() => {
        // 取消退出
      })
  }

  const menuItems = [
    { title: '我的订单', action: () => console.log('我的订单') },
    {
      title: '我的收藏',
      action: () => Taro.navigateTo({ url: '/pages/favorite/index' }),
    },
    { title: '优惠券', action: () => console.log('优惠券') },
    { title: '客服中心', action: () => console.log('客服中心') },
    { title: '设置', action: () => console.log('设置') },
  ]

  return (
    <>
      <View className="profile-page">
        {/* 顶部操作栏 */}
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

        {/* 用户信息区域 */}
        {isLoggedIn ? (
          <View className="user-info-section">
            <View className="user-avatar">
              {userInfo.avatar ? (
                <Text>{userInfo.name.charAt(0)}</Text>
              ) : (
                <UserOutline color="white" size={40} />
              )}
            </View>
            <View className="user-info">
              <Text className="user-name">{userInfo.name}</Text>
              <Text className="user-stats">粉丝 0 关注 0 赞 0 费过 0</Text>
            </View>
            <View
              className="home-link"
              onClick={() => Taro.switchTab({ url: '/pages/search/index' })}
            >
              <Text>主页 ＞</Text>
            </View>
          </View>
        ) : (
          <View className="user-info-section">
            <View className="user-avatar">
              <UserOutline color="white" size={40} />
            </View>
            <View className="user-info">
              <Text className="user-name">未登录</Text>
              <Text className="user-stats">登录后查看个人信息</Text>
            </View>
            <View
              className="home-link"
              onClick={() => Taro.switchTab({ url: '/pages/search/index' })}
            >
              <Text>主页 ＞</Text>
            </View>
          </View>
        )}

        {/* 会员等级区域 */}
        <View className="membership-section">
          <View className="membership-info">
            <View className="membership-badge">
              <Text>普通会员</Text>
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

        {/* 权益区域 */}
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

        {/* 数据统计区域 */}
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
            <Text className="stat-value">0</Text>
            <Text className="stat-label">积分</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">0</Text>
            <Text className="stat-label">优惠券</Text>
          </View>
        </View>

        {/* 订单状态入口 */}
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
            onClick={() => Taro.switchTab({ url: '/order' })}
          >
            <FileOutlineIcon />
            <Text>全部订单</Text>
          </View>
        </View>

        {/* 登录/退出登录按钮 */}
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

      {/* 底部导航栏区域 */}
      <BottomTabBar activeKey="profile" />
    </>
  )
}
