import { configureStore } from "@reduxjs/toolkit";
import serviceWorker from "../reducer/service_worker";

export const store = configureStore({
  reducer: {
    serviceWorker,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
