import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const loadCart = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        items.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse cart data')
      }
    }
  }

  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  const addItem = (book) => {
    const existing = items.value.find(item => item.id === book.id)
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1
    } else {
      items.value.push({ ...book, quantity: 1 })
    }
    saveCart()
  }

  const removeItem = (bookId) => {
    const index = items.value.findIndex(item => item.id === bookId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
    saveCart()
  }

  const updateQuantity = (bookId, quantity) => {
    const item = items.value.find(item => item.id === bookId)
    if (item) {
      if (quantity <= 0) {
        removeItem(bookId)
      } else {
        item.quantity = quantity
      }
      saveCart()
    }
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  })

  return {
    items,
    loadCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice
  }
})