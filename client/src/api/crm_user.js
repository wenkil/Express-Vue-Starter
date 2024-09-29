import request from '@/utils/request'

export function crmUserList(params) {
  return request({
    url: '/api/crm/user/list',
    method: 'get',
    params
  })
}

export function addCrmUser(data) {
  return request({
    url: '/api/crm/user/add',
    method: 'post',
    data
  })
}

export function updateCrmUser(data) {
  return request({
    url: '/api/crm/user/update',
    method: 'post',
    data
  })
}

export function allotCrmUser(data) {
  return request({
    url: '/api/crm/user/allot',
    method: 'post',
    data
  })
}

export function getFollowRecordList(params) {
  return request({
    url: '/api/crm/followrecord/list',
    method: 'get',
    params
  })
}

export function addFollowRecord(data) {
  return request({
    url: '/api/crm/followrecord/add',
    method: 'post',
    data
  })
}
