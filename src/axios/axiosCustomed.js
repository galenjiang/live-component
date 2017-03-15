import axios, { Axios } from 'axios';
// import _ from 'lodash';
// import { restfulAPI } from '../config';

const API_ROOT = 'http://test.live.videojj.com';
const TOKEN = undefined;
const DO_NOT_INTERCEPTOR_PORT = [
  'http://up.qiniu.com/',
  'https://up.qbox.me/',
];



// class AxiosCustomed extends Axios {
//   constructor() {
//     super();
//     // const { API_ROOT, API_VERSION, TOKEN, DO_NOT_INTERCEPTOR_PORT } = restfulAPI;
//     // this.defaults = _.cloneDeep(this.defaults);
//     this.defaults = {};
//     this.defaults.baseURL = API_ROOT;
//     this.defaults.withCredentials = false;
//     this.defaults.headers.token = TOKEN;
// // Add a request interceptor
//     this.interceptors.request.use(config => {
//       // Do something before request is sent
//       return config;
//     }, error => {
//       // Do something with request error
//       return Promise.reject(error);
//     });

// // Add a response interceptor
//     this.interceptors.response.use(response => {

//       // The request URL in some case do not interceptor
//       if (DO_NOT_INTERCEPTOR_PORT.indexOf(response.request.responseURL) >= 0) {
//         return response.data;
//       }

//       // response status must be 200
//       // response statusText must be 'OK'

//       const interceptors = response.data;

//       if (interceptors.status === 0) {
//         return interceptors.result;
//       }

//       return Promise.reject({ status: interceptors.status, msg: interceptors.msg, interceptor: true });
//     }, (error) => {
//       // Do something with response error
//       return Promise.reject(error);
//     });
//   }

//   setToken(token) {
//     this.defaults.headers.token = token;
//   }
// }

const axiosCustomed = axios.create({
  baseURL: API_ROOT,
  withCredentials: false,
  headers: {
    token: TOKEN,
  },
});

// axiosCustomed.defaults.withCredentials = false;
// axiosCustomed.defaults.headers.token = TOKEN;
axiosCustomed.interceptors.request.use(config => {
    // Do something before request is sent
  return config;
}, error => {
    // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axiosCustomed.interceptors.response.use(response => {

  // The request URL in some case do not interceptor
  if (DO_NOT_INTERCEPTOR_PORT.indexOf(response.request.responseURL) >= 0) {
    return response.data;
  }

  // response status must be 200
  // response statusText must be 'OK'

  const interceptors = response.data;

  if (interceptors.status === 0) {
    return interceptors.result;
  }

  return Promise.reject({ status: interceptors.status, msg: interceptors.msg, interceptor: true });
}, (error) => {
  // Do something with response error
  return Promise.reject(error);
});
axiosCustomed.setToken = (token) => {
  // console.log(axiosCustomed.defaults)
  // debugger
  axiosCustomed.defaults.headers.token = token;
};
window.axiosCustomed = axiosCustomed;
export default axiosCustomed;
