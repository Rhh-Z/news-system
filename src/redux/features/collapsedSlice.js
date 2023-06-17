import { createSlice } from "@reduxjs/toolkit";

export const collapsedSlice = createSlice({
  name: 'collapsed',
  initialState: {
    collapsed: false
  },
  reducers: {
    changeCollapsed: (state, { payload }) => {
      state.collapsed = payload
    }
  }
})


export const { changeCollapsed } = collapsedSlice.actions

export default collapsedSlice.reducer