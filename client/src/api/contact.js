import request from '@/utils/request'

export function contactList(params) {
  return request({
    url: '/api/crm/contact/list',
    method: 'get',
    params
  })
}

export function addContact(data) {
  return request({
    url: '/api/crm/contact/add',
    method: 'post',
    data
  })
}

export function updateContact(data) {
  return request({
    url: '/api/crm/contact/update',
    method: 'post',
    data
  })
}
