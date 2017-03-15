import jsonp from 'jsonp';
import axios from 'axios';
import AxiosCustomed from '../axios/axiosCustomed';

export default () => {
  return new Promise((resolve) => {
    jsonp('http://dev.videojj.com/api/jsonp/getCookie.js?callback=', {
      prefix: 'liveconsoleJSONP',
    }, (err, data) => {
      if (err || (data && typeof data === 'object' && !Object.keys(data).length)) {
        // redirect()
        return false;
      }
      axios.get(`http://test.live.videojj.com/api/users/auth/${data.token}`)
        .then(response => ({
          data: response.data,
          status: response.status,
        }))
        .then(({ data, status }) => {
          if (status !== 200 || data.status !== 0) {
            // redirect()
            return false;
          }
          AxiosCustomed.setToken(data.result.token);
          // return getUserInfo();
        })
        .then(userInfo => {
          // storage.setPlatformUserInfo(userInfo)
          resolve();
        });
    });
  });
};
