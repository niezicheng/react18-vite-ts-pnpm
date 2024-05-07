import axiosInstance from 'axios';
import qs from 'qs';
import { readFile } from 'utils';

// axios 配置
const config = {
  timeout: 600000,
  withCredentials: true
  // headers: {
  //   LocalCountry: 'GB'
  //   'Content-Type': 'application/json'
  // }
};

const axios = axiosInstance.create(config);

const defaultGetConfig = {
  paramsSerializer: (p: any) => qs.stringify(p, { arrayFormat: 'repeat' })
};
const defaultPostConfig = {};

// 请求拦截
axios.interceptors.request.use(
  request => {
    // 处理 token 逻辑等
    request.headers = Object.assign(request.headers, {});
    const defaultConfig = request.method === 'get' ? defaultGetConfig : defaultPostConfig;
    return {
      ...request,
      ...defaultConfig
    };
  },
  err => {
    return Promise.reject(err);
  }
);

// 响应拦截
axios.interceptors.response.use(
  async (response): Promise<any> => {
    const { config, data } = response;
    // 拦截示例模拟接口返回数据，后期正式使用时可以删除
    if (config.url === '/api/v2/pokemon/bulbasaur') {
      return Promise.resolve({
        data: {
          code: '0',
          info: data,
          msg: 'success'
        }
      });
    }
    // 处理下载文件
    if (Object.prototype.toString.call(data) === '[object Blob]') {
      const { type = '' } = data;
      if (type === 'application/octet-stream') {
        return Promise.resolve({ data: { info: data } });
      } else {
        const resBlob = await readFile(data as unknown as Blob);
        return Promise.reject(resBlob);
      }
      // 处理正常响应数据
    } else if (data.code === '0') {
      return Promise.resolve({ data });
      // 处理异常响应数据
    } else {
      return Promise.reject(data);
    }
  },
  err => {
    // 统一异常处理
    return Promise.reject(err);
  }
);

export default axios;
