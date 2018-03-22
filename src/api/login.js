import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/idm/user/login',
    method: 'post',
    data: {
      'payloads': [
        {
          'username': username,
          'password': password
        }
      ]
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/idm/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/idm/user/logout',
    method: 'get'
  })
}
