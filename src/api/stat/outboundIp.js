import request from '@/utils/request'

// 查询所有出站IP统计记录 (CRUD标准接口)
export function get(params) {
  return request({
    url: 'api/stat/outbound-ip',
    method: 'get',
    params
  })
}

// 保留原有getList方法以兼容现有代码
export function getList(params) {
  return get(params)
}

export default {
  get,
  getList(params) {
    return request({
      url: 'api/stat/outbound-ip',
      method: 'get',
      params
    })
  },
  getById(id) {
    return request({
      url: `api/stat/outbound-ip/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: 'api/stat/outbound-ip',
      method: 'post',
      data
    })
  },
  edit(data) {
    return request({
      url: `api/stat/outbound-ip/${data.id}`,
      method: 'put',
      data
    })
  },
  del(ids) {
    return request({
      url: 'api/stat/outbound-ip',
      method: 'delete',
      data: ids
    })
  },
  batchDel(ids) {
    return request({
      url: 'api/stat/outbound-ip',
      method: 'delete',
      data: ids
    })
  }
} 