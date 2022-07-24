

import axios from '../utils/axios'

export function createOrder(params) {
  return axios.post('mall/a/saveOrder', params);
}

export function getOrderList(params) {
  return axios.get('mall/a/order/list', { params });
}

export function getOrderDetail(id) {
  return axios.get(`mall/a/order/${id}`);
}

export function cancelOrder(id) {
  return axios.put(`mall/a/order/${id}/cancel`);
}

export function confirmOrder(id) {
  return axios.put(`mall/a/order/${id}/finish`)
}

export function payOrder(params) {
  return axios.get('mall/a/payOrder',  {params})
}




