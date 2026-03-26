import { configureStore } from '@reduxjs/toolkit'
import authReducer  from './slices/authSlice'
import inboxReducer from './slices/inboxSlice'
import uiReducer    from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth:  authReducer,
    inbox: inboxReducer,
    ui:    uiReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
