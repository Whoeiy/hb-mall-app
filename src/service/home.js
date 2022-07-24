

import axios from '../utils/axios'

export function getHome() {
  return axios.get('/mall/a/index/info');
}

