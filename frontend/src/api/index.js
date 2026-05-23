import request from '../utils/request'
import {
  mockCategories, mockBooks, mockUser,
  mockOrders, mockReviews, mockBooklists, fillCovers
} from '../mock'

/**
 * 包装请求，失败时降级到 mock 数据
 */
function withMock(apiFn, mockData, transform) {
  return async (...args) => {
    try {
      const res = await apiFn(...args)
      return res
    } catch (e) {
      console.warn('[mock]', e.message)
      return transform ? transform(mockData) : mockData
    }
  }
}

// ========== 用户 ==========
export const login = (data) => request.post('/users/login', data)
export const register = (data) => request.post('/users/register', data)
export const getUserProfile = withMock(() => request.get('/users/profile'), mockUser)
export const updateUserProfile = (data) => request.put('/users/profile', data)
export const getPointsLog = () => request.get('/users/points')

// ========== 图书 ==========
export const getBooks = withMock(
  (params) => request.get('/books', { params }),
  mockBooks,
  (data) => fillCovers(data)
)
export const getBookDetail = withMock(
  (id) => request.get(`/books/${id}`),
  null,
  (_, id) => {
    const book = mockBooks.find(b => String(b.id) === String(id)) || mockBooks[0]
    return { ...book, cover: book.cover || fillCovers([book])[0].cover }
  }
)

// ========== 分类 ==========
export const getCategories = withMock(
  () => request.get('/categories'),
  mockCategories
)

// ========== 购物车 ==========
export const getCart = () => request.get('/cart')
export const addToCart = (data) => request.post('/cart', data)
export const updateCartItem = (id, data) => request.put(`/cart/${id}`, data)
export const deleteCartItem = (id) => request.delete(`/cart/${id}`)

// ========== 订单 ==========
export const getOrders = withMock(
  (params) => request.get('/orders', { params }),
  mockOrders,
  (data) => fillCovers(data)
)
export const createOrder = (data) => request.post('/orders', data)
export const getOrderDetail = (id) => request.get(`/orders/${id}`)
export const cancelOrder = (id) => request.put(`/orders/${id}/cancel`)

// ========== 书评 ==========
export const getReviews = withMock(
  (params) => request.get('/reviews', { params }),
  mockReviews
)
export const createReview = (data) => request.post('/reviews', data)
export const likeReview = (id) => request.post(`/reviews/${id}/like`)

// ========== 书单 ==========
export const getBooklists = withMock(
  (params) => request.get('/booklists', { params }),
  mockBooklists,
  (data) => fillCovers(data)
)
export const createBooklist = (data) => request.post('/booklists', data)
