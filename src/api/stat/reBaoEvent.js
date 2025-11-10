import request from '@/utils/request'

// 分页查询安全季报列表（对应后端 reBaoEventController 的 page 方法）
export function getReBaoEventPage(params) {
  return request({
    url: '/api/stat/reBaoEvent/page', // 后端分页查询接口路径
    method: 'get',
    params // 传递分页参数（pageNum、pageSize、statisticTime、status等）
  })
}

// 根据ID查询安全季报详情（对应后端 getById 方法）
export function getReBaoEventById(id) {
  return request({
    url: `/api/stat/reBaoEvent/${id}`, // 后端详情接口路径
    method: 'get'
  })
}

// 新增安全季报（对应后端 create 方法）
export function addReBaoEvent(data) {
  return request({
    url: '/api/stat/reBaoEvent', // 后端新增接口路径
    method: 'post',
    data // 传递表单数据（statisticTime、searchCount等）
  })
}

// 修改安全季报（对应后端 update 方法）
export function updateReBaoEvent(data) {
  return request({
    url: `/api/stat/reBaoEvent/${data.id}`, // 后端修改接口路径
    method: 'put',
    data // 传递完整表单数据（含id）
  })
}

// 删除安全季报（对应后端 delete 方法）
export function deleteReBaoEvent(id) {
  return request({
    url: `/api/stat/reBaoEvent/${id}`, // 后端删除接口路径
    method: 'delete'
  })
}

// 批量删除安全季报（对应后端 batchDelete 方法）
export function batchDeleteReBaoEvent(ids) {
  return request({
    url: '/api/stat/reBaoEvent/batch', // 后端批量删除接口路径
    method: 'delete',
    data: ids // 传递id数组
  })
}

export default {
  getPage: getReBaoEventPage,
  getById: getReBaoEventById,
  add: addReBaoEvent,
  update: updateReBaoEvent,
  delete: deleteReBaoEvent,
  batchDelete: batchDeleteReBaoEvent
}
