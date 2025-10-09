import request from '@/utils/request'

// 查询所有异常事件统计 (CRUD标准接口)
export function get(params) {
  return request({
    url: 'api/stat/abnormal',
    method: 'get',
    params
  })
}

// 保留原有getList方法以兼容现有代码
export function getList(params) {
  return get(params)
}

// 根据ID查询异常事件统计
export function getById(id) {
  return request({
    url: `api/stat/abnormal/${id}`,
    method: 'get'
  })
}

// 创建异常事件统计
export function add(data) {
  return request({
    url: 'api/stat/abnormal',
    method: 'post',
    data
  })
}

// 更新异常事件统计
export function edit(data) {
  return request({
    url: `api/stat/abnormal/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个异常事件统计
export function del(id) {
  return request({
    url: `api/stat/abnormal/${id}`,
    method: 'delete'
  })
}

// 批量删除异常事件统计
export function batchDel(ids) {
  return request({
    url: 'api/stat/abnormal',
    method: 'delete',
    data: ids
  })
}

// 时间段查询 (保留原有功能)
export function getByTimePeriod(params) {
  return request({
    url: 'api/stat/abnormal/timePeriod',
    method: 'get',
    params
  })
}

// 关键字搜索 (保留原有功能)
export function searchByKeyword(params) {
  return request({
    url: 'api/stat/abnormal/search',
    method: 'get',
    params
  })
}

// 条件查询 (保留原有功能)
export function findByCriteria(criteria, params) {
  return request({
    url: 'api/stat/abnormal/criteria',
    method: 'post',
    data: { criteria, ...params }
  })
}

export default { get, getList, getById, add, edit, del, batchDel, getByTimePeriod, searchByKeyword, findByCriteria }