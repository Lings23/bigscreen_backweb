import request from '@/utils/request'

// 查询所有攻击飞线记录 (CRUD标准接口)
export function get(params) {
  return request({
    url: 'api/stat/attack',
    method: 'get',
    params
  })
}

// 保留原有getList方法以兼容现有代码
export function getList(params) {
  return get(params)
}

// 根据ID查询攻击飞线记录
export function getById(id) {
  return request({
    url: `api/stat/attack/${id}`,
    method: 'get'
  })
}

// 创建攻击飞线记录
export function add(data) {
  return request({
    url: 'api/stat/attack',
    method: 'post',
    data
  })
}

// 更新攻击飞线记录
export function edit(data) {
  return request({
    url: `api/stat/attack/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个攻击飞线记录
export function del(id) {
  return request({
    url: `api/stat/attack/${id}`,
    method: 'delete'
  })
}

// 批量删除攻击飞线记录
export function batchDel(ids) {
  return request({
    url: 'api/stat/attack',
    method: 'delete',
    data: ids
  })
}

export default { get, getList, getById, add, edit, del, batchDel } 