import request from '@/utils/request'

export function deleteUserByUsername(username) {
  return request({
    url: '/api/idm/user/' + username,
    method: 'delete'
  })
}
