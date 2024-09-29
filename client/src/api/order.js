import request from '@/utils/request'

export function orderApi(params, type) {
  if (type == 'list') {
    return request({
      url: '/api/order/list',
      method: 'get',
      params
    })
  }
  else{
    return request({
      url: `/api/order/${type}`,
      method: 'post',
      data:params
    })
  }
}

//查验审核权限
export function getCheckApprove(params) {
  return request({
    url: '/api/order/checkApprove',
    method: 'get',
    params
  })
}


//获取订单审核记录
export function getApprovelist(params) {
  return request({
    url: '/api/order/list/approvelist',
    method: 'get',
    params
  })
}

//获取订单流程记录
export function getOrderFlowRecordList(params) {
  return request({
    url: '/api/order/list/orderflowlist',
    method: 'get',
    params
  })
}

//审批订单
export function approveOrder(data) {
  return request({
    url: '/api/order/approve',
    method: 'post',
    data
  })
}
//取消订单
export function cancelOrder(data) {
  return request({
    url: '/api/order/cancel',
    method: 'post',
    data
  })
}

