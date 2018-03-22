import request from '@/utils/request'

export function getUserListByOrgId(orgId) {
  return request({
    url: '/api/idm/org/' + orgId + '/users',
    method: 'get'
  })
}
