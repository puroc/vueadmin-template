const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  currentRole: state => state.user.currentRole,
  permissions: state => state.user.permissions
}
export default getters
