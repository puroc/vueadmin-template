import request from '@/utils/request'

export function _getPermissions() {
  return request({
    url: '/api/idm/permission',
    method: 'get'
  })
}
