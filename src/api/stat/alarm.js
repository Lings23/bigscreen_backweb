import request from '@/utils/request'

// 查询所有告警统计记录 (CRUD标准接口)
export function get(params) {
  return request({
    url: 'api/stat/alarm',
    method: 'get',
    params
  })
}

// 保留原有getList方法以兼容现有代码
export function getList(params) {
  return get(params)
}

// 根据ID查询告警统计记录
export function getById(id) {
  return request({
    url: `api/stat/alarm/${id}`,
    method: 'get'
  })
}

// 创建告警统计记录
export function add(data) {
  return request({
    url: 'api/stat/alarm',
    method: 'post',
    data
  })
}

// 更新告警统计记录
export function edit(data) {
  return request({
    url: `api/stat/alarm/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个告警统计记录
export function del(id) {
  return request({
    url: `api/stat/alarm/${id}`,
    method: 'delete'
  })
}

// 批量删除告警统计记录
export function batchDel(ids) {
  return request({
    url: 'api/stat/alarm',
    method: 'delete',
    data: ids
  })
}

export default { get, getList, getById, add, edit, del, batchDel }