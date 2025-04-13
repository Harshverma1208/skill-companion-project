import { configureStore } from '@reduxjs/toolkit';

// We'll add the actual reducers later
const rootReducer = {
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 