import request from '@/utils/request'

export function backmoneyApi(params, type) {
  if (type == 'list') {
    return request({
      url: '/api/backmoney/list',
      method: 'get',
      params
    })
  }
  else{
    return request({
      url: `/api/backmoney/${type}`,
      method: 'post',
      data:params
    })
  }
}

//查验审核权限
export function getCheckApprove(params) {
  return request({
    url: '/api/backmoney/checkApprove',
    method: 'get',
    params
  })
}

//获取回款审核记录
export function getApprovelist(params) {
  return request({
    url: '/api/backmoney/list/approvelist',
    method: 'get',
    params
  })
}

//审核回款
export function approveOrder(data) {
  return request({
    url: '/api/backmoney/list/approvelist',
    method: 'post',
    data
  })
}

export function cancelOrder(data) {
  return request({
    url: '/api/backmoney/cancel',
    method: 'post',
    data
  })
}
