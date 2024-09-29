import moment from 'moment'
import config from '@/config'

export function toTime(time) {
  return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''
}

export function toDate(date) {
  return date ? moment(date).format('YYYY-MM-DD') : ''
}

export function toMoney(m) {
  return m ? (m / 100).toFixed(2) : ''
}

export function operateType(type) {
  switch (type) {
    case 1:
      return '新增'
    case 2:
      return '更新'
    case 3:
      return '查询'
    case 4:
      return '删除'
    case 5:
      return '登录'
    case 6:
      return '修改密码'
    case 7:
      return '审批'
    case 8:
      return '导出'
    default:
      return ''
  }
}

export function orderType(type) {
  switch (type) {
    case 1:
      return '体验产品订单'
    case 2:
      return '新签订单'
    case 3:
      return '复购订单'
    default:
      return ''
  }
}

export function orderApproveStatus(type) {
  switch (type) {
    case 1:
      return '待审批'
    case 2:
      return '已驳回'
    case 3:
      return '已通过'
    case 4:
      return '已退款'
    default:
      return ''
  }
}

export function cycleStatus(type) {
  switch (type) {
    case 1:
      return '未取消'
    case 2:
      return '已取消'
    default:
      return ''
  }
}

export function amountFilter(num){
  return (+num/100 || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function crm_tradeType(type) {
  if (!type) return ''
  let name = ''
  let arr = config.cus_trade.filter(item => {
    return item.id == type
  })
  return arr.length > 0 ? arr[0].name : ''
}

export function crm_levelType(type) {
  if (!type) return ''
  let name = ''
  let arr = config.cus_level.filter(item => {
    return item.id == type
  })
  return arr.length > 0 ? arr[0].name : ''
}
