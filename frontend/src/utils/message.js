import { showToast as vantToast } from 'vant'
import { ElMessage } from 'element-plus'

export const message = {
  success(content, duration = 2000) {
    if (typeof window !== 'undefined' && window.VANT_VERSION) {
      vantToast({ message: content, type: 'success', duration })
    } else {
      ElMessage.success({ message: content, duration })
    }
  },
  
  error(content, duration = 2000) {
    if (typeof window !== 'undefined' && window.VANT_VERSION) {
      vantToast({ message: content, type: 'error', duration })
    } else {
      ElMessage.error({ message: content, duration })
    }
  },
  
  warning(content, duration = 2000) {
    if (typeof window !== 'undefined' && window.VANT_VERSION) {
      vantToast({ message: content, type: 'warning', duration })
    } else {
      ElMessage.warning({ message: content, duration })
    }
  },
  
  info(content, duration = 2000) {
    if (typeof window !== 'undefined' && window.VANT_VERSION) {
      vantToast({ message: content, type: 'default', duration })
    } else {
      ElMessage.info({ message: content, duration })
    }
  }
}

export default message
