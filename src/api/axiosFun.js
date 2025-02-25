import axios from 'axios';

// 登录请求方法
const loginreq = (method, url, params) => {
    return axios({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: params,
    }).then(res => res.data);
};
// 通用公用方法
const req = (method, url, params) => {
    return axios({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('logintoken')
        },
        data: params,
    }).then(res => res.data);
};

export {
    loginreq,
    req
}
