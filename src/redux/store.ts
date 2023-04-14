// store/store.ts
// import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { createStore, Store } from 'redux';
// const store = configureStore({ reducer: rootReducer });
const store = createStore(rootReducer);
// export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = typeof store.dispatch;
export default store;
