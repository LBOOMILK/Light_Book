import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ========== 独立页面 ==========
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/user/UserLogin.vue'),
      meta: { title: '登录', isIndependent: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/user/register.vue'),
      meta: { title: '注册', isIndependent: true }
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../pages/admin/AdminLogin.vue'),
      meta: { title: '管理员登录', isIndependent: true }
    },

    // ========== 用户端 ==========
    {
      path: '/',
      component: () => import('../layouts/AppLayout.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../pages/home/index.vue'),
          meta: { title: '首页', isTab: true }
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('../pages/product/category.vue'),
          meta: { title: '分类', isTab: true }
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('../pages/order/cart.vue'),
          meta: { title: '购物车', isTab: true, requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('../pages/order/index.vue'),
          meta: { title: '订单', isTab: true, requiresAuth: true }
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('../pages/user/index.vue'),
          meta: { title: '我的', isTab: true }
        },
        {
          path: 'book/:id',
          name: 'book',
          component: () => import('../pages/product/detail.vue'),
          props: true,
          meta: { title: '图书详情' }
        },
        {
          path: 'reviews/:bookId',
          name: 'reviews',
          component: () => import('../pages/product/reviews.vue'),
          props: true,
          meta: { title: '书评' }
        },
        {
          path: 'booklist',
          name: 'booklist',
          component: () => import('../pages/community/booklist.vue'),
          meta: { title: '书单', isTab: true, requiresAuth: true }
        }
      ]
    },

    // ========== 后台管理 ==========
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { isAdmin: true },
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

  // 检查是否需要用户登录
  if (to.meta.requiresAuth) {
    const userToken = localStorage.getItem('token')
    if (!userToken) {
      // 未登录，跳转到登录页
      next('/login')
      return
    }
  }

  // 检查是否需要管理员登录
  if (to.meta.isAdmin) {
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      // 未登录，跳转到管理员登录页
      next('/admin/login')
      return
    }
  }

  // 已登录用户访问登录页，跳转到首页
  if (to.path === '/login' && localStorage.getItem('token')) {
    next('/home')
    return
  }

  // 已登录管理员访问管理员登录页，跳转到管理后台首页
  if (to.path === '/admin/login' && localStorage.getItem('admin_token')) {
    next('/admin')
    return
  }

  next()
})

export default router
