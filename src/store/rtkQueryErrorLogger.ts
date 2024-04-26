import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { message } from 'antd'
import { TMap } from 'types';

type TErrorPayload = { status: string; data: { info: TMap; msg: string } };

/**
 * RTK Query Error Logger
 */
const rtkQueryErrorLogger =
  () =>
  (next: (arg0: { payload: TErrorPayload }) => any) =>
  (action: { payload: TErrorPayload }) => {
    // Check if the action is an error
    if (isRejectedWithValue(action)) {
      // Log the error
      if (['100001'].includes(String(action?.payload?.status))) {
        // deal with api some status logic
      } else {
        const data = action?.payload?.data;
        message.error(data?.msg ?? 'The system is busy!');
      }
    }

    return next(action);
  };

export default rtkQueryErrorLogger as Middleware;
