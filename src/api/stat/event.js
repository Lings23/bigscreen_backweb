import request from '@/utils/request'

// 查询所有安全事件 (CRUD标准接口)
export function get(params) {
  return request({
    url: 'api/stat/event',
    method: 'get',
    params
  })
}

// 保留原有getList方法以兼容现有代码
export function getList(params) {
  return get(params)
}

// 根据ID查询安全事件
export function getById(id) {
  return request({
    url: `api/stat/event/${id}`,
    method: 'get'
  })
}

// 创建安全事件
export function add(data) {
  return request({
    url: 'api/stat/event',
    method: 'post',
    data
  })
}

// 更新安全事件
export function edit(data) {
  return request({
    url: `api/stat/event/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个安全事件
export function del(id) {
  return request({
    url: `api/stat/event/${id}`,
    method: 'delete'
  })
}

// 批量删除安全事件
export function batchDel(ids) {
  return request({
    url: 'api/stat/event',
    method: 'delete',
    data: ids
  })
}

export default { get, getList, getById, add, edit, del, batchDel } 