import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import VUE from 'vue'
import fa from 'element-ui/src/locale/lang/fa'
const that = new VUE()
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // console.log('to',to)

  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = sessionStorage.token

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if(store.getters.roles && store.getters.roles.length > 0){ //如果有缓存直接跳转
        next()
      }else{ //没有缓存先去动态获取权限列表
        let { info } = await store.dispatch('user/getInfo') //每次刷新页面都会获取用户权限
        const accessRoutes = await store.dispatch('permission/generateRoutes', info.menulist)
        router.addRoutes(accessRoutes)
        // console.log('accessRoutes',accessRoutes)
        next({ ...to, replace: true })
      }
    }
  } else {
    /* has no token*/
    //sessionStorage里没有token，直接将缓存清掉
    localStorage.clear()
    sessionStorage.clear()
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
