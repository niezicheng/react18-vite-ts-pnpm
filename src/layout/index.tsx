import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import SiderMenu from 'layout/components/SiderMenu';
import LayoutContext from 'layout/LayoutContext';
import { ErrorBoundary } from 'components';

const { Header, Content } = Layout;

// 侧边栏展开宽度
const siderWidth = 200;
const siderCollapsedWidth = 80;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [hideMenu, setHideMenu] = useState<boolean>(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  const toggleCollapsed = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const toggleHideMenu = (hideMenu: boolean) => {
    setHideMenu(hideMenu);
  };

  return (
    <ErrorBoundary>
      <LayoutContext.Provider
        value={{
          siderWidth,
          siderCollapsedWidth,
          collapsed,
          toggleCollapsed,
          hideMenu,
          toggleHideMenu
        }}
      >
        <Layout>
          <SiderMenu />
          <ErrorBoundary>
            <Layout style={{ height: '100vh' }}>
              <Header style={{ padding: 0, background: colorBgContainer }}>
                <Button
                  type='text'
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64
                  }}
                />
              </Header>
              <Content
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG
                }}
              >
                <Outlet />
              </Content>
            </Layout>
          </ErrorBoundary>
        </Layout>
      </LayoutContext.Provider>
    </ErrorBoundary>
  );
};

export default MainLayout;
