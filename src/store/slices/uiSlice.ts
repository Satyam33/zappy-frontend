import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    activeModal:      null as string | null,
  },
  reducers: {
    toggleSidebar(state)  { state.sidebarCollapsed = !state.sidebarCollapsed },
    openModal(state, action: PayloadAction<string>)  { state.activeModal = action.payload },
    closeModal(state)     { state.activeModal = null },
  },
})

export const { toggleSidebar, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer
