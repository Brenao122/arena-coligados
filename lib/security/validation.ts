export class SecurityValidator {
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/[<>]/g, "")
      .trim()
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
    return phoneRegex.test(phone)
  }

  static validateCPF(cpf: string): boolean {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    return cpfRegex.test(cpf)
  }

  static maskSensitiveData(data: string, type: "email" | "phone" | "cpf"): string {
    switch (type) {
      case "email":
        return data.replace(/(.{2}).*(@.*)/, "$1***$2")
      case "phone":
        return data.replace(/($$\d{2}$$\s\d{2})\d{3}(-\d{4})/, "$1***$2")
      case "cpf":
        return data.replace(/(\d{3}\.)\d{3}(\.\d{3}-\d{2})/, "$1***$2")
      default:
        return data.substring(0, 3) + "***"
    }
  }
}

export class RateLimiter {
  private static attempts = new Map<string, { count: number; resetTime: number }>()

  static checkLimit(key: string, limit = 10, windowMs = 60000): boolean {
    const now = Date.now()
    const attempt = this.attempts.get(key)

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (attempt.count >= limit) {
      return false
    }

    attempt.count++
    return true
  }
}
