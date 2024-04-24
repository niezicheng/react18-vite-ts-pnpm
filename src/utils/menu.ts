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