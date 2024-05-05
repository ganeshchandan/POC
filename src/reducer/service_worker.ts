import { createSlice } from "@reduxjs/toolkit";

export interface ServiceWorker {
  serviceWorkerUpdated: boolean;
}

const initialState: ServiceWorker = {
  serviceWorkerUpdated: false,
};

export const serviceWorker = createSlice({
  name: "serviceWorker",
  initialState,
  reducers: {
    updateServiceWorkerUpdate: (state, action) => {
      state.serviceWorkerUpdated = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateServiceWorkerUpdate } = serviceWorker.actions;

export default serviceWorker.reducer;
