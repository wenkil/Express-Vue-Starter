import request from '@/utils/request'

export function export_api(params) {
  return request({
    url: `/api/export/crmuser`,
    method: 'get',
    responseType: 'blob',
    params
  })
}
