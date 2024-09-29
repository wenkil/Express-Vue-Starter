import request from '@/utils/request'

export function getCrmSourceAnalyse(params) {
  return request({
    url: '/api/crm/analyse/source',
    method: 'get',
    params
  })
}

export function getCrmLevelAnalyse(params) {
  return request({
    url: '/api/crm/analyse/level',
    method: 'get',
    params
  })
}

export function getCrmTradeAnalyse(params) {
  return request({
    url: '/api/crm/analyse/trade',
    method: 'get',
    params
  })
}
