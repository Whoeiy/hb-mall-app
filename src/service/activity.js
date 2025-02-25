
import axios from '../utils/axios'

export function getForum(params) {
    return axios.get('mall/a/activity/list', { params });
}

export function getActivityDetail(id) {
    return axios.get(`mall/a/activity/${id}`);
}
export function getPostList(params) {
    return axios.get('mall/a/post/list', { params });
}
export function getPostDetail(id) {
    return axios.get(`mall/a/post/${id}`);
}
export function Post(params) {
    return axios.post('/mall/a/post', params);
}
export function uploadImgServer(params) {
    return axios.post('/mall/a/upload/file',  params );
}
export function likePost(params) {
    return axios.post('/mall/a/post/like', params);
}
export function getRankingList(id) {
    return axios.get(`/mall/a/activity/${id}/chart`);
}
export function getCoupon(params) {
    return axios.post('/mall/a/coupon/send',params);
}
