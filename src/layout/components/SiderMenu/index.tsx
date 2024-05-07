import { useState, useContext, useEffect, useCallback } from 'react';
import { Layout, Menu } from 'antd';
import Logo from 'layout/components/Logo';
import { isEmpty } from 'lodash-es';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutContext from 'layout/LayoutContext';
import { menusList } from 'config/menuConfig';
import { menusListMap, menusListFlat } from 'utils/menu';
import { TAntdMenuItem } from 'types';

const { Sider } = Layout;

const SiderMenu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { siderWidth, siderCollapsedWidth, collapsed, toggleCollapsed } = useContext(LayoutContext);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<Array<string>>([]);

  const items: TAntdMenuItem[] = menusListMap(menusList);

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

  const handleMenuClick = (item: { key: string }) => {
    setSelectedKeys([item?.key]);
    navigate(item?.key || '');
  };

  const handleMenuOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const handleToggleCollapsed = (collapsed: boolean) => {
    toggleCollapsed(collapsed);
  };

  return (
    <Sider
      trigger={null}
      width={siderWidth}
      collapsedWidth={siderCollapsedWidth}
      collapsible
      collapsed={collapsed}
      onCollapse={handleToggleCollapsed}
    >
      <Logo />
      <Menu
        theme='dark'
        mode='inline'
        items={items}
        selectedKeys={selectedKeys}
        openKeys={openKeys as string[]}
        onClick={handleMenuClick}
        onOpenChange={handleMenuOpenChange}
      />
    </Sider>
  );
};

export default SiderMenu;
