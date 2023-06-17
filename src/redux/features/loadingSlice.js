import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name:'loading',
  initialState: {
    isLoading:false
  },
  reducers:{
    changeIsLoading:(state,{payload})=>{
      state.isLoading = payload
    }
  }
})


export const {changeIsLoading} = loadingSlice.actions

export default loadingSlice.reducer