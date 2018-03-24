import request from '@/utils/request'

export function getUserListByOrgId(orgId, params) {
  return request({
    url: '/api/idm/org/' + orgId + '/users',
    method: 'get',
    params
  })
}
