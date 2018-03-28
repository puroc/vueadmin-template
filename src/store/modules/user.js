import { _login, _logout, _getInfo } from '@/api/login'

const user = {
  state: {
    token: '',
    username: '',
    password: '',
    name: '',
    roles: [],
    currentRole: {},
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
    }
  },

  actions: {
    // 登录
    Login({ commit }, { username, password }) {
      function login(resolve, reject) {
        _login(username.trim(), password.trim())
          .then(response => {
            const token = response.data.payloads[0].token
            commit('SET_TOKEN', token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      }
      return new Promise((resolve, reject) => {
        login(resolve, reject)
        setInterval(function() {
          console.log('re-login to refresh the token')
          login(resolve, reject)
        }, 30 * 60 * 1000)
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        _logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
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
        resolve()
      })
    },

    // 切换角色
    SwitchRole({ commit }, role) {
      commit('SET_CURRENT_ROLE', role)
    },

    // 获取用户信息
    GetInfo({ commit }, token) {
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
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
