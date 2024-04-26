import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { reducers, middlewares } from 'store/reducers';
import rtkQueryErrorLogger from 'store/rtkQueryErrorLogger';

export const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(rtkQueryErrorLogger, ...middlewares)
});

setupListeners(store.dispatch);

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

export const useAppDispatch: () => TAppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
