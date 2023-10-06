import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from './app/reducer';

const rootReducers = combineReducers({
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducers>;

export default rootReducers;
