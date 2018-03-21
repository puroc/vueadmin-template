import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    roles: [
      { 'id': 1, 'name': 1 },
      { 'id': 2, 'name': 2 }
    ],
    currentRole: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CURRENT_ROLE: (state, role) => {
      state.currentRole = role
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.userName.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        login(username, password).then(response => {
          const data = response.data
          const token = data.payloads[0].token
          setToken(token)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const user = response.data.payloads[0].user
          commit('SET_ROLES', user.roles)
          commit('SET_NAME', user.name)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
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

    SwitchRole({ commit }, role) {
      commit('SET_CURRENT_ROLE', role)
    }

  }
}

export default user
