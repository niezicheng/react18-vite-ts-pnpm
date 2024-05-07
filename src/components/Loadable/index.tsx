import React, { Suspense } from 'react';
import { Spin } from 'antd';
import { JSX } from 'react/jsx-runtime';

export const Loader = () => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Spin />
  </div>
);

const Loadable = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
  return function LoadableComponent(props: JSX.IntrinsicAttributes) {
    return (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

export default Loadable;
