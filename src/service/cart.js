
import axios from '../utils/axios'

export function addCart(params) {
  return axios.post('/mall/a/cart', params);
}

export function modifyCart(params) {
  return axios.post('/mall/a/cart', params);
}

export function getCart() {
  return axios.get('/mall/a/cart');
}

export function deleteCartItem(id) {
  return axios.delete(`/mall/a/cart?giftId=${id}`);
}

export function getByCartItemIds(params) {
  return axios.get('/mall/a/settle', { params });
}

export function getService(id) {
  return axios.get(`/mall/a/${id}/service`);
}

export function updateService(params) {
  return axios.put('/mall/a/settle',  params );
}


export function Recommend(id) {
  return axios.put(`/mall/a/gift/recommend/${id}`);
}