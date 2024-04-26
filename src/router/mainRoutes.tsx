import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from 'layout';
import { Loadable } from 'components';

const HomePage = Loadable(lazy(() => import('pages/home')));
const ExampleOne = Loadable(lazy(() => import('pages/example/example-one')));
const ExampleTwo = Loadable(lazy(() => import('pages/example/example-two')));
const Personal = Loadable(lazy(() => import('pages/overall/personal')));

const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Navigate to='/home' replace />
    },
    {
      path: 'home',
      element: <HomePage />
    },
    {
      path: 'example/one',
      element: <ExampleOne />
    },
    {
      path: 'example/two',
      element: <ExampleTwo />
    },
    {
      path: 'overall/personal',
      element: <Personal />
    },
    // 路由追加，勿删此注释
    { path: '*', element: <div>Not Found</div> }
  ]
};

export default mainRoutes;