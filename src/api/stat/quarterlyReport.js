import request from '@/utils/request'

// 分页查询安全季报列表（对应后端 /api/stat/quarterlyReport）
export function getQuarterlyReportPage(params) {
  return request({
    url: '/api/stat/quarterlyReport',
    method: 'get',
    params // 传递分页参数（pageNum、pageSize）及筛选条件（statisticTime、status等）
  })
}

// 根据ID查询安全季报详情
export function getQuarterlyReportById(id) {
  return request({
    url: `/api/stat/quarterlyReport/${id}`,
    method: 'get'
  })
}

// 新增安全季报
export function addQuarterlyReport(data) {
  return request({
    url: '/api/stat/quarterlyReport',
    method: 'post',
    data // 传递表单数据（与后端实体字段一致）
  })
}

// 修改安全季报
export function updateQuarterlyReport(data) {
  return request({
    url: `/api/stat/quarterlyReport/${data.id}`,
    method: 'put',
    data
  })
}

// 单条删除
export function deleteQuarterlyReport(id) {
  return request({
    url: `/api/stat/quarterlyReport/${id}`,
    method: 'delete'
  })
}

// 批量删除
export function batchDeleteQuarterlyReport(ids) {
  return request({
    url: '/api/stat/quarterlyReport/batch',
    method: 'delete',
    data: ids // 传递id数组
  })
}

export default {
  getPage: getQuarterlyReportPage,
  getById: getQuarterlyReportById,
  add: addQuarterlyReport,
  update: updateQuarterlyReport,
  delete: deleteQuarterlyReport,
  batchDelete: batchDeleteQuarterlyReport
}
