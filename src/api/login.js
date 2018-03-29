import request from '@/utils/request'

export function _login(username, password) {
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

export function _getInfo() {
  return request({
    url: '/api/idm/user/info',
    method: 'get'
  })
}

export function _logout() {
  return request({
    url: '/api/idm/user/logout',
    method: 'get'
  })
}

export function _refreshToken() {
  return request({
    url: '/api/idm/user/token',
    method: 'get'
  })
}
