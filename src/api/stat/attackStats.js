import request from '@/utils/request'

// 查询攻击统计列表
export function getAttackStatsList(params) {
  return request({
    url: '/api/stat/attackStats',
    method: 'get',
    params
  })
}

// 根据ID查询攻击统计详情
export function getAttackStatsById(id) {
  return request({
    url: `/api/stat/attackStats/${id}`,
    method: 'get'
  })
}

// 新增攻击统计
export function addAttackStats(data) {
  return request({
    url: '/api/stat/attackStats',
    method: 'post',
    data
  })
}

// 编辑攻击统计
export function editAttackStats(data) {
  return request({
    url: `/api/stat/attackStats/${data.id}`,
    method: 'put',
    data
  })
}

// 删除攻击统计
export function delAttackStats(id) {
  return request({
    url: `/api/stat/attackStats/${id}`,
    method: 'delete'
  })
}

// 批量删除攻击统计
export function batchDelAttackStats(ids) {
  return request({
    url: '/api/stat/attackStats/batch',
    method: 'delete',
    data: ids
  })
}

export default {
  getList: getAttackStatsList,
  getById: getAttackStatsById,
  add: addAttackStats,
  edit: editAttackStats,
  del: delAttackStats,
  batchDel: batchDelAttackStats
}
