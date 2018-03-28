import request from '@/utils/request'

export function _getUserListByOrgId(orgId, params) {
  return request({
    url: '/api/idm/org/' + orgId + '/users',
    method: 'get',
    params
  })
}

export function _deleteUserList(orgId, userList) {
  return request({
    url: '/api/idm/org/' + orgId + '/users',
    method: 'delete',
    data: {
      payloads: userList
    }
  })
}
