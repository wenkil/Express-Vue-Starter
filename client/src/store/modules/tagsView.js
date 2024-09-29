import locale from "element-ui/src/mixins/locale";
import fa from "element-ui/src/locale/lang/fa";

const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    let visitedViews = localStorage.visitedViews == undefined ? [] : JSON.parse(localStorage.visitedViews)

    let obj = {
      fullPath:view.fullPath,
      hash: view.hash,
      meta:{
        icon: view.meta.table,
        noCache: view.meta.noCache,
        title:  view.meta.title,
        affix:view.meta.affix
      },
      name:  view.name,
      path:  view.path
    }
    let isHas = false
    for(let i=0;i<visitedViews.length;i++){
      if(visitedViews[i].name == obj.name){
        isHas = true
        break
      }
    }
    if(!isHas){
      visitedViews.push(obj)
    }
    localStorage.setItem('visitedViews',JSON.stringify(visitedViews))

    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )

  },
  ADD_CACHED_VIEW: (state, view) => {
    // console.log('state',state)
    // console.log('view',view)
    let cachedViews = localStorage.cachedViews == undefined ? [] : JSON.parse(localStorage.cachedViews)
    // console.log('21',cachedViews)
    if(cachedViews.indexOf(view.name) == -1){
      cachedViews[cachedViews.length]= view.name
    }
    localStorage.setItem('cachedViews',JSON.stringify(cachedViews))
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }, view) {
    // if(localStorage.tagsList == undefined) {
    //   localStorage.tagsList = []
    // }
    // console.log('view',view)
    // console.log('this.$store.state',this.state)
    // let visitedViews = []
    // let cachedViews = []
    // visitedViews.push(view)
    // cachedViews.push(view.name)
    //
    // localStorage.visitedViews = JSON.stringify(visitedViews)
    // localStorage.cachedViews = JSON.stringify(cachedViews)
    // localStorage.setItem('tagsList',JSON.stringify(tagsList))
    // console.log('localStorage.tagsList',localStorage)
    // localStorage.tagsList = JSON.stringify(this.state.tagsView)
    // console.log('localStorage.tagsList',localStorage.tagsList)
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
