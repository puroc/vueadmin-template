import request from '@/utils/request'

export function deleteUserByUsername(username) {
  return request({
    url: '/api/idm/user/' + username,
    method: 'delete'
  })
}

export function editUserByUsername(user) {
  return request({
    url: '/api/idm/user/' + user.username,
    method: 'put',
    data: {
      'payloads': [
        {
          'name': user.name,
          'sex': user.sex,
          'birthday': user.birthday,
          'phone': user.phone,
          'email': user.email,
          'orgId': user.orgId
        }
      ]
    }
  })
}
