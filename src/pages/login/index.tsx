import { View, Text, ScrollView, Input, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, showToast } from '@tarojs/taro'
import { LeftOutline } from 'antd-mobile-icons'
import { authApi } from '@/services/api'
import './index.less'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const fromPage = router.params.fromPage as string

  const handleSendCode = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      })
      return
    }

    try {
      const response = await authApi.sendCode(phone)
      if (response.success) {
        showToast({
          title: '验证码已发送',
          icon: 'success',
        })
        setShowCodeInput(true)
        setCode('')
        setCountdown(60)
      } else {
        showToast({
          title: response.message || '验证码发送失败',
          icon: 'none',
        })
      }
    } catch (error: any) {
      console.error('发送验证码失败:', error)
      showToast({
        title: error.response?.data?.message || '验证码发送失败',
        icon: 'none',
      })
    }
  }

  const handleLogin = async (loginCode?: string) => {
    const codeToUse = loginCode || code

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      })
      return
    }

    if (!showCodeInput) {
      showToast({
        title: '请先获取验证码',
        icon: 'none',
      })
      return
    }

    if (!codeToUse || codeToUse.length !== 6) {
      showToast({
        title: '请输入6位验证码',
        icon: 'none',
      })
      return
    }

    if (isLoggingIn) {
      return
    }

    setIsLoggingIn(true)
    try {
      const response = await authApi.login(phone, codeToUse)
      if (response.success) {
        const { user, token, isNewUser } = response.data

        Taro.setStorageSync('isLoggedIn', true)
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', {
          id: user.id,
          phone: user.phone,
          name: user.nickname,
          avatar: user.avatar,
        })

        showToast({
          title: isNewUser ? '注册成功' : '登录成功',
          icon: 'success',
        })

        setTimeout(() => {
          if (fromPage) {
            Taro.redirectTo({
              url: decodeURIComponent(fromPage),
            })
          } else {
            Taro.navigateBack()
          }
        }, 1000)
      } else {
        showToast({
          title: response.message || '登录失败',
          icon: 'none',
        })
        setIsLoggingIn(false)
      }
    } catch (error: any) {
      console.error('登录失败:', error)
      showToast({
        title: error.response?.data?.message || '登录失败，请重试',
        icon: 'none',
      })
      setIsLoggingIn(false)
    }
  }

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setCode(numericValue)
  }

  const handleBack = () => {
    if (fromPage) {
      Taro.navigateTo({
        url: fromPage,
      })
    } else {
      Taro.navigateBack()
    }
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (code.length === 6 && showCodeInput && !isLoggingIn) {
      handleLogin(code)
    }
  }, [code])

  const codeDigits = code.split('')
  const codeBoxes = Array(6)
    .fill('')
    .map((_, i) => codeDigits[i] || '')

  return (
    <View className="login-page">
      <View className="top-nav-bar">
        <View className="nav-left">
          <View className="back-btn" onClick={handleBack}>
            <LeftOutline color="#fff" />
          </View>
        </View>
        <View className="nav-right">
          <Text className="register-btn">注册</Text>
        </View>
      </View>

      <ScrollView className="login-content" scrollY>
        <View className="login-container">
          <View className="login-header">
            <Text className="login-title">手机验证码登录</Text>
            <Text className="login-subtitle">未注册手机验证后即可完成注册</Text>
          </View>

          <View className="phone-input-container">
            <View className="country-code">+ 86</View>
            <Input
              className="phone-input"
              placeholder="请输入手机号"
              value={phone}
              onInput={(e) => setPhone(e.detail.value)}
              type="number"
              maxlength={11}
              autoFocus
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                border: 'none',
                backgroundColor: 'transparent',
              }}
            />
          </View>

          <View className="code-input-container">
            {showCodeInput && (
              <View
                className="code-inputs-container"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: '15px',
                }}
              >
                {codeBoxes.map((digit, index) => (
                  <View
                    key={index}
                    className="code-box"
                    style={{
                      width: '40px',
                      height: '45px',
                      border: digit
                        ? '2px solid #1890ff'
                        : '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      margin: '0 4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {digit}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {showCodeInput && (
              <Input
                className="code-input"
                placeholder="请输入6位验证码"
                value={code}
                onInput={(e) => handleCodeChange(e.detail.value)}
                type="number"
                maxlength={6}
                focus
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 16px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  letterSpacing: '8px',
                }}
              />
            )}

            <Button
              className={`code-btn ${countdown > 0 ? 'disabled' : ''}`}
              onClick={handleSendCode}
              disabled={countdown > 0}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                backgroundColor:
                  countdown > 0
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.2)',
                color: countdown > 0 ? 'rgba(255, 255, 255, 0.5)' : '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                marginTop: showCodeInput ? '15px' : '0',
              }}
            >
              {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
            </Button>
          </View>

          <View className="other-login-methods">
            <Text className="login-method-text">账号密码登录</Text>
            <Text className="login-method-text">境外手机密码登录</Text>
          </View>

          <View className="third-party-login">
            <View className="third-party-icon">
              <Text className="icon">💬</Text>
            </View>
            <View className="third-party-icon">
              <Text className="icon">💙</Text>
            </View>
            <View className="third-party-icon">
              <Text className="icon">🍎</Text>
            </View>
            <View className="third-party-icon">
              <Text className="icon">•••</Text>
            </View>
          </View>

          <View className="service-agreement">
            <Text className="agreement-text">
              阅读并同意携程的《服务协议》和《个人信息保护指引》
            </Text>
          </View>

          <View className="login-help">
            <Text className="help-text">登录遇到问题</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
