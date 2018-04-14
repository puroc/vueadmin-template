import { _login, _logout, _getInfo, _refreshToken } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { _getOrgInfo } from '@/api/org'

const user = {
  state: {
    token: getToken(),
    username: '',
    password: '',
    name: '',
    roles: [],
    currentRole: {},
    currentOrg: {},
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INFO: (state, { username, password, name }) => {
      state.name = name
      state.username = username
      state.password = password
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CURRENT_ROLE: (state, role) => {
      try {
        state.currentRole = role
        state.permissions = []
        for (let i = 0; i < role.permissions.length; i++) {
          state.permissions.push(role.permissions[i].code)
        }
      } catch (err) {
        console.log(err)
      }
    },
    SET_CURRENT_ORG: (state, org) => {
      state.currentOrg = org
    }
  },

  actions: {
    // 登录
    Login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        // cookie中存储的token可能会过期，所以先删除他
        commit('SET_TOKEN', '')
        removeToken()
        // 发送登陆请求
        _login(username.trim(), password.trim())
          .then(response => {
            const token = response.data.payloads[0].token
            commit('SET_TOKEN', token)
            setToken(token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 刷新token
    RefreshToken({ commit }) {
      return new Promise((resolve, reject) => {
        _refreshToken()
          .then(response => {
            const token = response.data.payloads[0].token
            commit('SET_TOKEN', token)
            setToken(token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        _logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 切换角色
    SwitchRole({ commit }, role) {
      commit('SET_CURRENT_ROLE', role)
    },

    // 获取用户信息
    GetInfo({ dispatch, commit }, token) {
      return new Promise((resolve, reject) => {
        _getInfo()
          .then(response => {
            const user = response.data.payloads[0]
            commit('SET_ROLES', user.roles)
            commit('SET_INFO', user)
            // 默认取第一个角色
            if (user.roles.length !== 0) {
              commit('SET_CURRENT_ROLE', user.roles[0])
            }
            commit('SET_CURRENT_ORG', user.roles[0].org)
            resolve()
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    },
    SwitchOrg({ commit }, orgId) {
      return new Promise((resolve, reject) => {
        _getOrgInfo(orgId)
          .then(response => {
            commit('SET_CURRENT_ORG', response.data.payloads[0])
            resolve()
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    }
  }
}

export default user
