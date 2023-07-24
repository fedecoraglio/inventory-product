import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { categoryApi } from './api/category.api';

/**
 * The configureStore() function does a lot behind the scene — it automatically connects the app to
 * Redux DevTools and adds redux-thunk middleware by default to handle asynchronous operations
 */
export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({}).concat([categoryApi.middleware]),
});

/**
 * To enable refetchOnFocus and refetchOnReconnect behaviors in the app,
 * we passed the dispatch method available on the store to the setupListeners() function.
 */
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
