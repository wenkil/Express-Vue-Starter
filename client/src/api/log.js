import request from '@/utils/request'


export function getOperateLogList(params) {
  return request({
    url: '/api/user/operate/list',
    method: 'get',
    params
  })
}
