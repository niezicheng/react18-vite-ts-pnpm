# 后台管理基础框架搭建(三) - 状态管理、网络请求

## 前言

本文主要介绍如何使用 `Redux Toolkit` 进行状态管理，以及如何使用 `Redux Toolkit Query` 进行网络请求。

## 项目结构

```zsh
├── pages # 页面
│   ├── demo # 示例页面
│   │   ├── index.tsx # 示例页面入口
├── store # Redux 状态管理
│   ├── pokemon # pokemon 状态模块
│   │   ├── index.tsx # 示例状态切片入口
│   │   ├── service.ts # 示例状态服务
│   │   ├── slice.ts # 示例状态切片
│   │   └── type.ts # 示例状态类型
│   ├── customBaseQuery.ts # 自定义基础网络请求
│   ├── index.ts # Redux store 入口
│   └── reducers.ts # Redux reducers
├── utils # 工具函数
│   ├── request.ts # 网络请求
├── App.tsx # App 入口
├── index.tsx # 项目入口
└── react-app-env.d.ts # TypeScript 声明文件
```

## 依赖安装

```zsh
pnpm install @reduxjs/toolkit react-redux
```

## 创建 store

```typescript
// store/index.tsx
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// 创建 store
export const store = configureStore({
  reducer: {}
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch

export const useAppDispatch: () => TAppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector
```

## 注入 store

```typescript
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from 'store'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

## 创建 Redux 状态切片​

### Redux 状态类型

```typescript
// store/pokemon/type.ts
export type TPokemonState = {
  value: number
}
```

### Redux 状态切片

```typescript
// store/pokemon/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TPokemonState } from './type'

const initialState: TPokemonState = {
  value: 0,
}

export const pokemonSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const pokemonActions = pokemonSlice.actions
export default pokemonSlice.reducer
```

## 创建 Redux 状态服务

### Redux 状态类型

```typescript
// store/pokemon/type.ts
export type TPokemonState = {
  value: number
}
```

### Redux 状态服务

```typescript
// store/pokemon/service.ts
// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { TPokemonRes } from './type'

// Define a service using a base URL and expected endpoints
export const pokemonService = createApi({
  reducerPath: 'pokemonService',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<TPokemonRes, string>({
      query: (name) => `pokemon/${name}`,
    }),
  }),
})

```

## Redux 切片、服务加入 Store

```typescript
// store/pokemon/index.ts
export { pokemonService } from './service'
export { default, pokemonActions } from './slice';
```

### Redux reducers、middlewares

```typescript
// store/reducers.ts
import pokemonReducer, { pokemonService } from "store/pokemon";

// 导入reducer
export const reducers = {
  pokemon: pokemonReducer,
  [pokemonService.reducerPath]: pokemonService.reducer,
}

// 注入 middleware
export const middlewares = [
  pokemonService.middleware,
]
```

### Redux reducers、middlewares 加入 Store

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { reducers, middlewares } from 'store/reducers'

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    }).concat(...middlewares)
    return middleware
  },
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch

export const useAppDispatch: () => TAppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector
```

## Redux 使用

```typescript
// pages/demo.tsx
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from 'store';
import { pokemonActions, pokemonService } from 'store/pokemon';

const { increment, decrement } = pokemonActions;
const { useGetPokemonByNameQuery } = pokemonService;

const DemoPage = () => {
  const { value } = useAppSelector(state => state.pokemon);
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetPokemonByNameQuery({});

  return (
    <div>
      {isLoading ? (
        <span>Loading</span>
      ) : (
        <>
          <h3>{data?.species.name}</h3>
          <img src={data?.sprites.front_shiny} alt={data?.species.name} />
        </>
      )}
      <>{value}</>
      <div>
        <Button onClick={() => dispatch(increment())}>Increment</Button>
        <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      </div>
    </div>
  );
};

export default DemoPage;
```

## 网络请求

### 依赖安装

```zsh
pnpm install axios
```

### 创建网络请求

```typescript
// utils/request.ts
import axiosInstance from 'axios'
import qs from 'qs'
import { readFile } from 'utils'

// axios 配置
const config = {
  timeout: 600000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}

const axios = axiosInstance.create(config)

const defaultGetConfig = {
  paramsSerializer: (p: any) => qs.stringify(p, { arrayFormat: 'repeat' }),
}
const defaultPostConfig = {}

// 请求拦截
axios.interceptors.request.use(
  (request) => {
    // 处理 token 逻辑等
    request.headers = Object.assign(request.headers, {})
    const defaultConfig = request.method === 'get' ? defaultGetConfig : defaultPostConfig
    return {
      ...request,
      ...defaultConfig,
    }
  }, (err) => {
    return Promise.reject(err)
  }
)

// 响应拦截
axios.interceptors.response.use(
  async (response): Promise<any> => {
    const { data: mockData } = response
    // mock 规定响应结构数据
    const data = { code: '0', msg: '', info: mockData, type: '' }
    // 处理下载文件
    if (Object.prototype.toString.call(data) === '[object Blob]') {
      const { type = '' } = data
      if (type === 'application/octet-stream') {
        return Promise.resolve({ data })
      } else {
        const resBlob = await readFile(data as unknown as Blob)
        return Promise.reject(resBlob)
      }
    // 处理正常响应数据
    } else if (data.code === '0') {
      return Promise.resolve({ data })
    // 处理异常响应数据
    } else {
      return Promise.reject(data)
    }
  }, (err) => {
    // 统一异常处理
    return Promise.reject(err)
  }
)

export default axios
```

### 自定义 baseQuery

```typescript
// store/customBaseQuery.ts
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { AxiosRequestConfig } from 'axios'
import axios from 'utils/request'
import type { IApiResponse } from 'types'

/**
 * 自定义请求
 * @returns
 * 需要根据后端接口数据规范作出调整
 */
export const customBaseQuery =
  (
    { baseUrl = '' }: { baseUrl?: string } = { baseUrl: '' }
  ): BaseQueryFn<{
    url: string
    method?: AxiosRequestConfig['method']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['data']
  }> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const result = await axios({ url: `${baseUrl}${url}`, method, data, params })
      return { data: result?.data?.info || {} }
    } catch (axiosError) {
      const err = axiosError as IApiResponse<null>
      return {
        error: {
          status: err?.code,
          data: {
            msg: (err?.msg || err.info) ?? '系统繁忙',
            info: err?.info,
          },
        },
      }
    }
  }
```

### 使用网络请求

```typescript
// store/pokemon/service.ts
// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from 'store/customBaseQuery'
import * as api from './api'
import type { TPokemonRes } from './type'

// Define a service using a base URL and expected endpoints
export const pokemonService = createApi({
  reducerPath: 'pokemonService',
  baseQuery: customBaseQuery({ baseUrl: '' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<TPokemonRes, {}>({
      query: (params) => ({
        url: api.getPokemonApi,
        method: 'get',
        params,
      }),
    }),
  }),
})
```

### 开发代理

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api/': {
        target: 'https://pokeapi.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
```
