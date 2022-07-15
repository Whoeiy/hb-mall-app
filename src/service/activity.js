
import axios from '../utils/axios'

export function getForum(params) {
    return axios.get('mall/a/activity/list', { params });
}
