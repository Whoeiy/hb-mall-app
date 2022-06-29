
import axios from '../utils/axios'

export function addCart(params) {
  return axios.post('/mall/a/cart', params);
}

export function modifyCart(params) {
  return axios.put('/mall/a/cart', params);
}

export function getCart(params) {
  return axios.get('/mall/a/cart', { params });
}

export function deleteCartItem(id) {
  return axios.delete(`/mall/a/cart/${id}`);
}

export function getByCartItemIds(params) {
  return axios.get('/shop-cart/settle', { params });
}

