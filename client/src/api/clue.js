import request from '@/utils/request'


export function clueList(params) {
  return request({
    url: '/api/crm/clue/list',
    method: 'get',
    params
  })
}
export function addClue(data) {
  return request({
    url: '/api/crm/clue/add',
    method: 'post',
    data
  })
}
export function updateClue(data) {
  return request({
    url: '/api/crm/clue/update',
    method: 'post',
    data
  })
}

export function clueSourceList(params) {
  return request({
    url: '/api/crm/clueSource/list',
    method: 'get',
    params
  })
}
export function addClueSource(data) {
  return request({
    url: '/api/crm/clueSource/add',
    method: 'post',
    data
  })
}
export function updateClueSource(data) {
  return request({
    url: '/api/crm/clueSource/update',
    method: 'post',
    data
  })
}

export function allotClueSingle(data) {
  return request({
    url: '/api/crm/clue/allot/single',
    method: 'post',
    data
  })
}

export function allotClue(data) {
  return request({
    url: '/api/crm/clue/allot',
    method: 'post',
    data
  })
}

export function divertClue(data) {
  return request({
    url: '/api/crm/clue/divert',
    method: 'post',
    data
  })
}
