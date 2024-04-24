import { TMenuItemData } from 'types';

// 菜单配置
export const menusList: TMenuItemData[] = [
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
      },
      {
        id: 22,
        name: '示例2',
        path: '/example/two',
        icon: 'AppstoreOutlined'
      }
    ]
  },
  {
    id: 3,
    name: '全局配置',
    path: '/overall',
    icon: 'AppstoreOutlined',
    children: [
      {
        id: 31,
        name: '个人信息',
        path: '/overall/personal',
        icon: 'AppstoreOutlined'
      },
    ]
  }
];