import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}
export function updateUsre(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}
export function getUserList(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}
export function getUserInfo(params) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params
  })
}
export function changePawssword(data) {
  return request({
    url: '/api/user/changpwd',
    method: 'post',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/api/user/status',
    method: 'post',
    data
  })
}
export function getRoleList(params) {
  return request({
    url: '/api/user/role/list',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/api/user/role/add',
    method: 'post',
    data
  })
}
export function updateRole(data) {
  return request({
    url: '/api/user/role/update',
    method: 'post',
    data
  })
}
// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
