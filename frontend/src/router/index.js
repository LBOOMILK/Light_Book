import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ========== 用户端 ==========
    {
      path: '/',
      redirect: '/home',
      meta: { title: '首页' }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../pages/home/index.vue'),
      meta: { title: '首页', isTab: true }
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../pages/product/category.vue'),
      meta: { title: '分类', isTab: true, isShowNav: true }
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../pages/order/cart.vue'),
      meta: { title: '购物车', isTab: true, isShowNav: true, isShowBack: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../pages/order/index.vue'),
      meta: { title: '订单', isTab: true, isShowNav: true, requiresAuth: true }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../pages/user/index.vue'),
      meta: { title: '我的', isTab: true }
    },
    {
      path: '/book/:id',
      name: 'book',
      component: () => import('../pages/product/detail.vue'),
      props: true,
      meta: { title: '图书详情', isShowNav: true, isShowBack: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/user/login.vue'),
      meta: { title: '登录', isShowNav: true, isShowBack: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/user/register.vue'),
      meta: { title: '注册', isShowNav: true, isShowBack: true }
    },
    {
      path: '/reviews/:bookId',
      name: 'reviews',
      component: () => import('../pages/product/reviews.vue'),
      props: true,
      meta: { title: '书评', isShowNav: true, isShowBack: true }
    },
    {
      path: '/booklist',
      name: 'booklist',
      component: () => import('../pages/community/booklist.vue'),
      meta: { title: '书单', isTab: true, isShowNav: true }
    },

    // ========== 后台管理 ==========
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, isAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../pages/admin/Dashboard.vue'),
          meta: { title: '仪表盘' }
        },
        {
          path: 'books',
          name: 'admin-books',
          component: () => import('../pages/admin/Books.vue'),
          meta: { title: '图书管理' }
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('../pages/admin/Categories.vue'),
          meta: { title: '分类管理' }
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('../pages/admin/Orders.vue'),
          meta: { title: '订单管理' }
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../pages/admin/Users.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: 'reviews',
          name: 'admin-reviews',
          component: () => import('../pages/admin/Reviews.vue'),
          meta: { title: '书评管理' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Light Book` : 'Light Book'

  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  next()
})

export default router
