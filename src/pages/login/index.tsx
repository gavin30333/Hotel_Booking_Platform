import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, showToast } from '@tarojs/taro'
import { LeftOutline } from 'antd-mobile-icons'
import './index.less'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const codeInputs = Array(6).fill('')

  // 从路由参数中获取来源页面信息
  const fromPage = router.params.fromPage as string

  // 处理手机号输入
  const handlePhoneChange = (e: any) => {
    setPhone(e.detail.value)
  }

  // 处理验证码输入
  const handleCodeChange = (e: any) => {
    setCode(e.detail.value)
  }

  // 发送验证码
  const handleSendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return
    }

    // 模拟发送验证码
    showToast({
      title: '验证码已发送',
      icon: 'success'
    })

    // 显示验证码输入框
    setShowCodeInput(true)

    // 开始倒计时
    setCountdown(60)
  }

  // 处理登录
  const handleLogin = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return
    }

    if (!showCodeInput) {
      showToast({
        title: '请先获取验证码',
        icon: 'none'
      })
      return
    }

    if (!code) {
      showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }

    setLoading(true)

    // 模拟登录请求
    setTimeout(() => {
      // 存储登录状态
      Taro.setStorageSync('isLoggedIn', true)
      // 存储用户信息
      Taro.setStorageSync('userInfo', {
        phone,
        name: '用户' + phone.slice(-4)
      })

      showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 登录成功后跳转
      if (fromPage) {
        // 如果是拦截跳转，跳转回触发拦截的页面
        Taro.navigateTo({
          url: fromPage
        })
      } else {
        // 默认返回上一页
        Taro.navigateBack()
      }

      setLoading(false)
    }, 1000)
  }

  // 处理返回
  const handleBack = () => {
    if (fromPage) {
      // 如果是拦截跳转，跳转回触发拦截的页面
      Taro.navigateTo({
        url: fromPage
      })
    } else {
      // 默认返回上一页
      Taro.navigateBack()
    }
  }

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  return (
    <View className="login-page">
      {/* 顶部导航栏 */}
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

      {/* 内容区域 */}
      <ScrollView className="login-content" scrollY>
        <View className="login-container">
          <View className="login-header">
            <Text className="login-title">手机验证码登录</Text>
            <Text className="login-subtitle">未注册手机验证后即可完成注册</Text>
          </View>

          {/* 手机号输入 */}
          <View className="phone-input-container">
            <View className="country-code">+ 86</View>
            <input
              className="phone-input"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              maxLength={11}
              autoFocus
              style={{flex: 1, padding: '12px', fontSize: '14px', border: 'none', backgroundColor: 'transparent'}}
            />
          </View>

          {/* 验证码输入 */}
          <View className="code-input-container">
            {showCodeInput && (
              <View className="code-inputs-container">
                {codeInputs.map((_, index) => (
                  <input
                    key={index}
                    type="tel"
                    maxLength={1}
                    value={code[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value >= '0' && value <= '9') {
                        const newCode = code.slice(0, index) + value + code.slice(index + 1)
                        setCode(newCode)
                        // 自动跳转到下一个输入框
                        if (index < 5 && value) {
                          const nextInput = document.querySelectorAll('.code-inputs-container input')[index + 1] as HTMLInputElement
                          if (nextInput) {
                            nextInput.focus()
                          }
                        }
                        // 填完六个数字后自动登录
                        if (newCode.length === 6) {
                          setTimeout(() => handleLogin(), 300)
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !code[index] && index > 0) {
                        // 自动跳转到上一个输入框
                        const prevInput = document.querySelectorAll('.code-inputs-container input')[index - 1] as HTMLInputElement
                        if (prevInput) {
                          prevInput.focus()
                        }
                        const newCode = code.slice(0, index - 1) + code.slice(index)
                        setCode(newCode)
                      }
                    }}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      fontSize: '18px',
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                      margin: '0 5px'
                    }}
                  />
                ))}
              </View>
            )}
            <button 
              className={`code-btn ${countdown > 0 ? 'disabled' : ''}`}
              onClick={handleSendCode}
              disabled={countdown > 0}
              style={{width: '100%', height: '44px', padding: '0 16px', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff', fontSize: '14px', boxSizing: 'border-box', marginTop: showCodeInput ? '15px' : '0'}}
            >
              {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
            </button>
          </View>

          {/* 其他登录方式 */}
          <View className="other-login-methods">
            <Text className="login-method-text">账号密码登录</Text>
            <Text className="login-method-text">境外手机密码登录</Text>
          </View>

          {/* 第三方登录 */}
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

          {/* 服务协议 */}
          <View className="service-agreement">
            <input 
              className="checkbox" 
              type="checkbox" 
              checked={true}
              disabled
              style={{marginTop: '2px'}}
            />
            <Text className="agreement-text">阅读并同意携程的《服务协议》和《个人信息保护指引》</Text>
          </View>

          {/* 登录遇到问题 */}
          <View className="login-help">
            <Text className="help-text">登录遇到问题</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
