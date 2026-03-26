import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const inboxSlice = createSlice({
  name: 'inbox',
  initialState: {
    activeConversationId: null as string | null,
    unreadCount:          0,
    wsConnected:          false,
  },
  reducers: {
    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload
    },
    incrementUnread(state)        { state.unreadCount += 1 },
    resetUnread(state)            { state.unreadCount = 0 },
    setWsConnected(state, action: PayloadAction<boolean>) {
      state.wsConnected = action.payload
    },
  },
})

export const { setActiveConversation, incrementUnread, resetUnread, setWsConnected } = inboxSlice.actions
export default inboxSlice.reducer
