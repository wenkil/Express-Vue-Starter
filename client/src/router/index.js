import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home', affix: true }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'profile',
        meta: { title: '个人中心', icon: 'user', noCache: true },
      },
    ],
  },
]

export const asyncRoutes = [
  // {
  //   path: '/sys-introduce',
  //   component: Layout,
  //   redirect: '/sys-introduce/index',
  //   children: [{
  //     path: 'sys-introduce',
  //     name: 'sys-introduce',
  //     component: () => import('@/views/system/introduce'),
  //     meta: { title: '系统介绍', icon: 'el-icon-star-on'}
  //   }]
  // },
  {
    path: '/sysTemManager',
    component: Layout,
    alwaysShow: true,
    name:'sysTemManager',
    meta: {
      title: '系统设置',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'backend-user',
        component: () => import('@/views/system/user/index'),
        name: 'backend-user',
        meta: { title: '用户管理', icon: 'el-icon-user',id:1011, noCache: true }
      },
      {
        path: 'role-list',
        component: () => import('@/views/system/role/index'),
        name: 'role-list',
        meta: { title: '权限配置', icon: 'el-icon-rank',id:1013, noCache: true }
      },
      {
        path: 'operate-log',
        component: () => import('@/views/system/log/index'),
        name: 'operate-log',
        meta: { title: '操作日志', icon: 'el-icon-edit-outline',id:1012, noCache: true }
      },
    ]
  },
  {
    path: '/customerManager',
    component: Layout,
    alwaysShow: true,
    name:'customerManager',
    meta: {
      title: '客户管理',
      icon: 'el-icon-s-custom'
    },
    children: [
      {
        path: 'clue-entry',
        component: () => import('@/views/customer/clue-entry/index'),
        name: 'clue-entry',
        meta: { title: '线索管理', icon: 'el-icon-s-help',id:2011, noCache: false }
      },
      {
        path: 'customer-list',
        component: () => import('@/views/customer/customer-list/index'),
        name: 'customer-list',
        meta: { title: '客户列表', icon: 'el-icon-s-custom',id:2012, noCache: false }
      },
      {
        path: 'contact-list',
        component: () => import('@/views/customer/contact-list/index'),
        name: 'contact-list',
        meta: { title: '联系人', icon: 'el-icon-phone',id:2013, noCache: false }
      },
      {
        path: 'follow-up-records',
        component: () => import('@/views/customer/follow-up-records/index'),
        name: 'follow-up-records',
        meta: { title: '跟进记录', icon: 'el-icon-s-order',id:2014, noCache: false }
      },

    ]
  },
  {
    path: '/sys-analysis',
    component: Layout,
    alwaysShow: true,
    name:'sys_analysis',
    meta: {
      title: '系统分析',
      icon: 'el-icon-data-line'
    },
    children: [
      {
        path: 'customer-analysis',
        component: () => import('@/views/customer/customer-analysis/index'),
        name: 'customer-analysis',
        meta: { title: '客户分析', icon: 'el-icon-s-help',id:4011, noCache: false }
      },
      {
        path: 'flow-analysis',
        component: () => import('@/views/customer/flow-analysis/index'),
        name: 'flow-analysis',
        meta: { title: '流程分析', icon: 'el-icon-s-data',id:4012, noCache: false }
      },
    ]
  },
  {
    path: '/oa',
    component: Layout,
    alwaysShow: true,
    name:'oamgr',
    meta: {
      title: '行政管理',
      icon: 'el-icon-collection'
    },
    children: [
      {
        path: 'dep-mgr',
        component: () => import('@/views/oa/department/index'),
        name: 'dep-mgr',
        meta: { title: '部门管理', icon: 'el-icon-s-home',id:3011, noCache: true }
      },
      {
        path: 'staff',
        component: () => import('@/views/oa/staff/index'),
        name: 'staff',
        meta: { title: '员工列表', icon: 'el-icon-s-home',id:3012, noCache: true }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '产品管理',
      icon: 'el-icon-s-shop',
    },
    children: [
      {
        path: 'goods_type',
        component: () => import('@/views/goods/goods_type/index'),
        name: 'goods_type',
        meta: {
          title: '产品类型',
          icon: 'el-icon-files',
          noCache: true,
          id: 5011,
        },
      },
      {
        path: 'goods_list',
        component: () => import('@/views/goods/goods_list/index'),
        name: 'goods_list',
        meta: {
          title: '产品列表',
          icon: 'el-icon-takeaway-box',
          noCache: true,
          id: 5012,
        },
      },
    ],
  },
  {
    path: '/order',
    component: Layout,
    children: [{
      path: 'order-list',
      name: 'order-list',
      component: () => import('@/views/order/index'),
      meta: { title: '订单列表', icon: 'el-icon-s-order', id: 6001 }
    }]
  },
  {
    path: '/backmoney',
    component: Layout,
    children: [{
      path: 'back-money',
      name: 'back-money',
      component: () => import('@/views/backmoney/index'),
      meta: { title: '回款列表', icon: 'el-icon-document-checked', id: 6002 }
    }]
  },



  //动态路由里必须把404放在最后,否则刷新时会直接跳转到404 !!!
  { path: '*', redirect: '/404', hidden: true }
]

const
  createRouter = () => new Router({
    mode: 'hash', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
