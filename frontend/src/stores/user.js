import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = reactive({
    id: null,
    username: '',
    avatar: '',
    points: 0,
    email: '',
    phone: ''
  })

  const loadUser = () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        Object.assign(user, data)
      } catch (e) {
        console.error('Failed to parse user data')
      }
    }
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (userData) => {
    Object.assign(user, userData)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    token.value = null
    Object.assign(user, {
      id: null,
      username: '',
      avatar: '',
      points: 0,
      email: '',
      phone: ''
    })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isLogin = () => {
    return !!token.value
  }

  return {
    token,
    user,
    loadUser,
    setToken,
    setUser,
    logout,
    isLogin
  }
})