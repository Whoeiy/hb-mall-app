/**
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 */

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


