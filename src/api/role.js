import request from '@/utils/request'
import store from '@/store'

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
          name: role.name,
          orgId: store.getters.currentOrg.id
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
          orgId: store.getters.currentOrg.id
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
