import request from '@/utils/request'

export function goodsType(params, type) {
  if (type == 'list') {
    return request({
      url: '/api/goods/type/list',
      method: 'get',
      params
    })
  }
  else{
    return request({
      url: `/api/goods/type/${type}`,
      method: 'post',
      data:params
    })
  }
}

export function getGoodsAllLevelList(params) {
  return request({
    url: '/api/goods/type/allLevelList',
    method: 'get',
    params
  })
}

export function goodsList(params, type) {
  if (type == 'list') {
    return request({
      url: '/api/goods/list',
      method: 'get',
      params
    })
  }
  else{
    return request({
      url: `/api/goods/${type}`,
      method: 'post',
      data:params
    })
  }
}
export function goodsTypeCheckrelevance(data, type){
  return request({
    url: `/api/goods/type/checkrelevance`,
    method: 'post',
    data:data
  })
}
