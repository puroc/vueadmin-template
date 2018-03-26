import request from '@/utils/request'

export function _deleteUser(user) {
  return request({
    url: '/api/idm/user/' + user.username,
    method: 'delete'
  })
}

export function _editUser(user) {
  return request({
    url: '/api/idm/user/' + user.username,
    method: 'put',
    data: {
      payloads: [
        {
          name: user.name,
          sex: user.sex,
          birthday: user.birthday,
          phone: user.phone,
          email: user.email,
          orgId: user.orgId
        }
      ]
    }
  })
}

export function _addUser(user) {
  return request({
    url: '/api/idm/user',
    method: 'post',
    data: {
      payloads: [
        {
          username: user.username,
          name: user.name,
          password: user.password,
          sex: user.sex,
          birthday: user.birthday,
          phone: user.phone,
          email: user.email,
          orgId: user.orgId
        }
      ]
    }
  })
}
