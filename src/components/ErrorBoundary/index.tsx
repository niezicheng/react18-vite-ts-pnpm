import { ErrorInfo } from 'react';
import { Result, Button } from 'antd';
import {
  ErrorBoundary as RErrorBoundary,
  withErrorBoundary as withErrorBoundaryHook
} from 'react-error-boundary';
import { errorHandler, hardReload } from 'utils';

interface IProps {
  onError?: (error: Error, info: ErrorInfo) => void;
  children?: React.ReactNode;
}

const fallbackRender = ({ error }: { error: Error }) => {
  console.log(
    '%c👉  error: ',
    'background:#41b883;padding:1px; border-radius: 0 3px 3px 0;color: #fff',
    error
  ); // 👈

  return (
    <Result
      status='500'
      title='Something went wrong!'
      subTitle='Please try refreshing the page or contact the administrator.'
      extra={
        <Button type='primary' onClick={hardReload}>
          Refresh Page
        </Button>
      }
    />
  );
};

const ErrorBoundary = (props: IProps) => {
  const { onError = errorHandler, children } = props;
  return (
    <RErrorBoundary fallbackRender={fallbackRender} onError={onError}>
      {children}
    </RErrorBoundary>
  );
};

export const withErrorBoundary = (component: React.LazyExoticComponent<() => JSX.Element>) =>
  withErrorBoundaryHook(component, {
    fallbackRender,
    onError: errorHandler
  });

export default ErrorBoundary;
