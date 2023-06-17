import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore,persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import collapsedSlice from "./features/collapsedSlice";
import loadingSlice from "./features/loadingSlice";

const persistConfig = {
  key:'root',
  storage,
  blacklist:[loadingSlice]
}

const reducers = combineReducers({
  collapsed: collapsedSlice,
  loading:loadingSlice
})

const persistedReducer = persistReducer(persistConfig,reducers)

const store = configureStore({
  reducer:persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [ thunk ]
})
const persiststore = persistStore(store)

export { store , persiststore}