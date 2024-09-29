import request from '@/utils/request'

export function depList(params) {
  return request({
    url: '/api/department/list',
    method: 'get',
    params
  })
}

export function addDep(data) {
  return request({
    url: '/api/department/add',
    method: 'post',
    data
  })
}

export function updateDep(data) {
  return request({
    url: '/api/department/update',
    method: 'post',
    data
  })
}

export function deleteDep(data) {
  return request({
    url: '/api/department/delete',
    method: 'post',
    data
  })
}

export function staffList(params) {
  return request({
    url: '/api/staff/list',
    method: 'get',
    params
  })
}

export function addStaff(data, type) {
  return request({
    url: `/api/staff/${type}`,
    method: 'post',
    data
  })
}
