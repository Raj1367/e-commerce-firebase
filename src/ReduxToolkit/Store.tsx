import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import cartReducer from './CartSlice';
import filterReducer from './FilterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer, 
    filter: filterReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;  
export type AppDispatch = typeof store.dispatch;

export default store;
