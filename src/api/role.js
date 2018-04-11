import request from '@/utils/request'

export function _deleteRole(role) {
  return request({
    url: '/api/idm/role/' + role.id,
    method: 'delete'
  })
}

export function _editRole(role) {
  return request({
    url: '/api/idm/role/' + role.id,
    method: 'put',
    data: {
      payloads: [
        {
          name: role.name
        }
      ]
    }
  })
}

export function _addRole(role) {
  return request({
    url: '/api/idm/role',
    method: 'post',
    data: {
      payloads: [
        {
          name: role.name,
          orgId: role.orgId
        }
      ]
    }
  })
}

export function _deleteRoleList(roleList) {
  return request({
    url: '/api/idm/role',
    method: 'delete',
    data: {
      payloads: roleList
    }
  })
}
