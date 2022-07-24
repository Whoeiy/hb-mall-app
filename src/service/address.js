

import axios from '../utils/axios'

export function addAddress(params) {
  return axios.post('/mall/a/address', params);
}

export function EditAddress(params) {
  return axios.put('/mall/a/address', params);
}

export function DeleteAddress(id) {
  return axios.delete(`/mall/a/address/${id}`);
}

export function getDefaultAddress() {
  return axios.get('/mall/a/address/default');
}

export function getAddressList() {
  return axios.get('/mall/a/address/list', { pageNumber: 1, pageSize: 1000 })
}

export function getAddressDetail(id) {
  return axios.get(`/mall/a/address/${id}`)
}


