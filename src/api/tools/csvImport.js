import request from '@/utils/request'

// 获取所有表名
export function getAllTables() {
  return request({
    url: '/api/csv/tables',
    method: 'get'
  })
}

// 新建表
export function createTable(data) {
  return request({
    url: '/api/csv/createTable',
    method: 'post',
    data
  })
}

// 导入数据到指定表
export function importCsv(data) {
  return request({
    url: '/api/csv/import',
    method: 'post',
    data
  })
}

// ========== 表字段元数据管理API ==========

// 查询表字段元数据列表
export function getTableMetadata(params) {
  return request({
    url: '/api/tableMetadata',
    method: 'get',
    params
  })
}

// 根据表名查询字段信息
export function getTableColumns(tableName) {
  return request({
    url: `/api/tableMetadata/columns/${tableName}`,
    method: 'get'
  })
}

// 新增表字段元数据
export function addTableMetadata(data) {
  return request({
    url: '/api/tableMetadata',
    method: 'post',
    data
  })
}

// 修改表字段元数据
export function updateTableMetadata(data) {
  return request({
    url: '/api/tableMetadata',
    method: 'put',
    data
  })
}

// 删除表字段元数据
export function deleteTableMetadata(ids) {
  return request({
    url: '/api/tableMetadata',
    method: 'delete',
    data: ids
  })
}

// 导出表字段元数据
export function exportTableMetadata(params) {
  return request({
    url: '/api/tableMetadata/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

