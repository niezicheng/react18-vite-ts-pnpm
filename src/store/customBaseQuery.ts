import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig } from 'axios';
import axios from 'utils/request';
import type { IApiResponse } from 'types';

type TCustomBaseQueryParams = { baseUrl?: string; isLive?: boolean };

/**
 * 自定义请求, 依据后端接口数据规范作出调整
 * @returns
 */
export const customBaseQuery =
  ({ baseUrl = '' }: TCustomBaseQueryParams = { baseUrl: '' }): BaseQueryFn<{
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['data'];
  }> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const result = await axios({ url: `${baseUrl}${url}`, method, data, params });
      return { data: result?.data?.info || {} };
    } catch (axiosError) {
      const err = axiosError as IApiResponse<null>;
      return {
        error: {
          status: err?.code,
          data: {
            msg: (err?.msg || err.info) ?? '系统繁忙',
            info: err?.info
          }
        }
      };
    }
  };
