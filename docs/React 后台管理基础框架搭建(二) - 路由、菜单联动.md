# 后台管理基础框架搭建(二) - 菜单配置、路由配置

## 前言

本文主要介绍如何使用 `react-router v6` 实现路由和菜单联动，以及如何使用 `antd v5` 的 `Menu` 组件实现侧边栏菜单。

## 路由实现

通过 `react-router v6` 的 `<BrowserRouter />` 组件结合 `useRoutes` 实现，将路由相关配置存放在 `router` 文件夹中。详细结构如下所示：

```zsh
├── router # 路由
│   ├── index.ts # 路由入口
│   └── mainRouter.tsx # 主路由配置
├── App.tsx # App 入口
└── main.tsx # 项目入口
```

### 依赖安装

```zsh
pnpm install react-router-dom
```

### 路由配置

在 `router/mainRouter.tsx` 文件定义主路由配置信息，并结合菜单章节定义的公共路由/菜单 `router/paths.ts` 文件，实现路由配置信息。如下所示：

```typescript
// router/mainRouter.tsx
import { lazy } from 'react';
import MainLayout from 'layout';
import { Loadable } from 'components';

const HomePage = Loadable(lazy(() => import('pages/home')));
const Example = Loadable(lazy(() => import('pages/demo')));

const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'home',
      element: <HomePage />
    },
    {
      path: 'example/one',
      element: <Example />
    },
    // 路由追加，勿删此注释
    { path: '*', element: <div>Not Found</div> }
  ]
};

export default mainRoutes;

```

### 路由入口

通过 `useRoutes hook` 将路由配置信息传入，`useRoutes hook` 会返回一个 `element`，这个 `element` 就是路由的入口，将其放入 `App` 组件中即可。如下所示：

```typescript
// router/index.tsx
import { useRoutes } from 'react-router-dom'
import mainRoutes from 'router/mainRoutes'

export default function ThemeRoutes() {
  return useRoutes([mainRoutes])
}
```

将路由入口放入 `App` 组件中，如下所示：

```typescript
// App.tsx
import Routes from 'router'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}

export default App
```

## 菜单实现

通过对 `antd v5` 的 `Menu` 封装 `SiderMenu` 侧边栏组件，在 `config/menuConfig.ts` 文件中定义菜单数组信息，而菜单工具函数则放置在 `utils/menu.ts` 文件中。详细结构如下：

```zsh
├── config
│   ├── menuConfig.ts # 菜单配置信息
├── layout # 布局
│   ├── components # 组件
│   │   ├── SiderMenu # 侧边栏菜单
│   │   │   └── index.tsx # 侧边栏菜单组件
│   │   └── index.tsx # 布局组件
├── utils # 工具函数
│   └── menu.ts # 菜单工具函数
├── App.tsx # 根组件
└── main.tsx # 入口文件
```

### 依赖安装

```zsh
pnpm install antd
```

### 菜单数据配置

在 `config/menuConfig.ts` 文件中定义菜单配置数组 `menusList`【后续动态接口获取】，如下所示：

```typescript
// config/menuConfig.ts
import { TMenu } from 'types';

// 菜单配置
export const menusList: TMenu[] = [
  {
    id: 1,
    name: '首页',
    path: '/home',
    icon: 'HomeOutlined'
  },
  {
    id: 2,
    name: '示例',
    path: '/example',
    icon: 'AppstoreOutlined',
    children: [
      {
        id: 21,
        name: '示例1',
        path: '/example/one',
        icon: 'AppstoreOutlined'
      }
    ]
  }
];
```

### 菜单工具函数

菜单工具函数放置在 `utils/menu.ts` 中，主要是对菜单列表 `menusList` 进行处理，添加 `icon` 属性，以及将菜单列表映射为 `antd v5` 的 `Menu` 组件所需的数据结构等。如下所示：

```typescript
import React from 'react'
import * as Icons from '@ant-design/icons'
import { TMenuItemData, TAntdMenuItem } from 'types'

const iconList: any = Icons

/**
 * menusListMap 菜单配置映射
 * @param menus 菜单对象
 * @returns 新的菜单对象
 */
export const menusListMap = (menus: TMenuItemData[]): TAntdMenuItem[] => {
  return menus.map((menu) => {
    const { name, children, icon, path } = menu
    const newMenu: any = { key: path, label: name }
    if (icon) {
      newMenu.icon = React.createElement(iconList[icon])
    }
    if (children) {
      newMenu['children'] = menusListMap(children)
    }
    return newMenu
  }) || []
}

/**
 * menusListMap 菜单配置映射
 * @param menus 菜单对象
 * @returns 新的菜单对象
 */
export const menusListFlat = (menus: TMenuItemData[]): TMenuItemData[] => {
  return menus.reduce((pre, cur) => {
    if (cur.children) {
      return [...pre, cur, ...menusListFlat(cur.children)];
    } else {
      return [...pre, cur];
    }
  }, [] as TMenuItemData[]);
};
```

### 侧边栏菜单组件

结合上面的菜单列表数据 `menusList` 和 `antd` 布局及菜单控件实现侧边栏展示。

#### 菜单状态控制

各类情形【页面刷新、页面返回、菜单收缩等】的菜单状态。简易代码如下所示：

```typescript
// layout/components/SiderMenu/index.tsx
import { useEffect, useCallback } from 'react';
import { menusList } from 'config/menuConfig'
import { menusListFlat } from 'utils/menu'

const SiderMenu = () => {
  // 处理页面刷新或菜单收缩展开时，菜单选中几展开状态
  const handleMenuOpen = useCallback(() => {
    const openKeys: string[] = [];
    menusListFlat(menusList)?.forEach(item => {
      if (pathname.includes(item.path)) {
        if (isEmpty(item?.children)) {
          setSelectedKeys([item.path]);
        } else {
          openKeys?.push(item.path);
        }
      }
    });
    setOpenKeys(openKeys);
  }, [pathname, menusList]);

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
    } else {
      handleMenuOpen();
    }
  }, [handleMenuOpen, collapsed]);

  return (
    ...
  )
};

export default SiderMenu;
```

## 拓展

[react + react-router v6 + antd5实现动态路由和动态菜单](https://juejin.cn/post/7290017662141694006)
