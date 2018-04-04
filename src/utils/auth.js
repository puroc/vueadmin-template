import Cookies from 'js-cookie'

const TokenKey = 'JWT-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  removeCurrentOrg()
  return Cookies.remove(TokenKey)
}

const orgKey = 'CURRENT-ORG'

export function getCurrentOrg() {
  return Cookies.get(orgKey)
}

export function setCurrentOrg(token) {
  return Cookies.set(orgKey, token)
}

export function removeCurrentOrg() {
  return Cookies.remove(orgKey)
}

