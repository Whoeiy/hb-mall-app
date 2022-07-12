

import axios from '../utils/axios'

export function getUserInfo() {
  return axios.get('/user/info');
}

export function EditUserInfo(params) {
  return axios.put('/user/info', params);
}

export function login(params) {
  return axios.post('/mall/a/user/login', params);
}

export function logout() {
  return axios.delete('/mall/a/user/logout')
}

export function register(params) {
  return axios.post('/mall/a/user/register', params);
}

