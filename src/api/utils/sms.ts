interface SmsCode {
  code: string
  expiresAt: number
}

const smsCodes: Map<string, SmsCode> = new Map()

const CODE_LENGTH = 6
const CODE_EXPIRE_TIME = 5 * 60 * 1000

export const generateCode = (): string => {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

export const sendSmsCode = async (
  phone: string
): Promise<{ success: boolean; code?: string }> => {
  const code = generateCode()
  const expiresAt = Date.now() + CODE_EXPIRE_TIME

  smsCodes.set(phone, { code, expiresAt })

  console.log(`[SMS Mock] 发送验证码到手机 ${phone}: ${code}`)

  return {
    success: true,
    code,
  }
}

export const verifySmsCode = (phone: string, code: string): boolean => {
  const storedCode = smsCodes.get(phone)

  if (!storedCode) {
    console.log(`[SMS Mock] 手机号 ${phone} 没有验证码记录`)
    return false
  }

  if (Date.now() > storedCode.expiresAt) {
    smsCodes.delete(phone)
    console.log(`[SMS Mock] 手机号 ${phone} 的验证码已过期`)
    return false
  }

  if (storedCode.code !== code) {
    console.log(
      `[SMS Mock] 手机号 ${phone} 验证码错误: 输入 ${code}, 正确 ${storedCode.code}`
    )
    return false
  }

  smsCodes.delete(phone)
  console.log(`[SMS Mock] 手机号 ${phone} 验证码验证成功`)
  return true
}

export default {
  sendSmsCode,
  verifySmsCode,
}
