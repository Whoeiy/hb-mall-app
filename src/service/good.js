
import axios from '../utils/axios'

export function getDetail(id) {
  return axios.get(`/mall/a/gift/detail/${id}`);
}

export function getCategory() {
  return axios.get('/mall/a/categories');
}
export function getLabels() {
  return axios.get('/mall/a/labels');
}

export function search(params) {
  return axios.get('/mall/a/es/search', {params});
}

