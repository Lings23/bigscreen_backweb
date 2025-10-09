import request from '@/utils/request'

// 查询所有风险统计记录 (CRUD标准接口)
export function get(params) {
  return request({
    url: 'api/stat/risk',
    method: 'get',
    params
  })
}

// 保留原有getList方法以兼容现有代码
export function getList(params) {
  return get(params)
}
