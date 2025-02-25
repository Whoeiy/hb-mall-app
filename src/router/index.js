import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ '@/views/Search.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/category',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ '@/views/Category.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/label',
      name: 'label',
      component: () => import(/* webpackChunkName: "label" */ '@/views/Label.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/special',
      name: 'special',
      component: () => import(/* webpackChunkName: "label" */ '@/views/Special.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/send',
      name: 'send',
      component: () => import(/* webpackChunkName: "label" */ '@/views/Send.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/holiday',
      name: 'holiday',
      component: () => import(/* webpackChunkName: "label" */ '@/views/Holiday.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/product-list',
      name: 'product-list',
      component: () => import(/* webpackChunkName: "product-list" */ '@/views/ProductList.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import(/* webpackChunkName: "product" */ '@/views/ProductDetail.vue'),
      meta: {
        index: 3
      }
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import(/* webpackChunkName: "forum" */ '@/views/Forum.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import(/* webpackChunkName: "activity" */ '@/views/Activity.vue'),
      meta: {
        index: 3
      }
    },
    {
      path: '/post',
      name: 'post',
      component: () => import(/* webpackChunkName: "post" */ '@/views/Post.vue'),
      meta: {
        index: 3
      }
    },
    {
      path: '/postdetail',
      name: 'postdetail',
      component: () => import(/* webpackChunkName: "postdetail" */ '@/views/PostDetail.vue'),
      meta: {
        index: 3
      }
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import(/* webpackChunkName: "cart" */ '@/views/Cart.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/create-order',
      name: 'create-order',
      component: () => import(/* webpackChunkName: "create-order" */ '@/views/CreateOrder.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import(/* webpackChunkName: "order" */ '@/views/Order.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/order-detail',
      name: 'order-detail',
      component: () => import(/* webpackChunkName: "order-detail" */ '@/views/OrderDetail.vue'),
      meta: {
        index: 3
      }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "user" */ '@/views/User.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import(/* webpackChunkName: "setting" */ '@/views/Setting.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/address',
      name: 'address',
      component: () => import(/* webpackChunkName: "address" */ '@/views/Address.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/coupon',
      name: 'coupon',
      component: () => import(/* webpackChunkName: "address" */ '@/views/Coupon.vue'),
      meta: {
        index: 2
      }
    },
    {
      path: '/address-edit',
      name: 'address-edit',
      component: () => import(/* webpackChunkName: "address-edit" */ '@/views/AddressEdit.vue'),
      meta: {
        index: 3
      }
    },
    {
      path: '/coupon-edit',
      name: 'coupon-edit',
      component: () => import(/* webpackChunkName: "coupon-edit" */ '@/views/CouponEdit.vue'),
      meta: {
        index: 3
      }
    },
    {
      path:'/custom-add',
      name:'custom-add',
      component: () => import(/* webpackChunkName: "custom-add" */ '@/views/addGiftCustom.vue'),
    },
    {
      path:'/private-custom-add',
      name:'private-custom-add',
      component: () => import(/* webpackChunkName: "custom-add" */ '@/views/privateCustom.vue'),
    },
    {
      path:'/ranking',
      name:'ranking',
      component: () => import(/* webpackChunkName: "custom-add" */ '@/views/ranking.vue'),
    },

  ]
})

export default router