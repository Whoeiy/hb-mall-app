

import axios from '../utils/axios'

export function getUserInfo() {
  return axios.get('/mall/a/info');
}

export function EditUserInfo(params) {
  return axios.put('/mall/a/info', params);
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

export function getCoupon() {
  return axios.get('/mall/a/coupon/list');
}


