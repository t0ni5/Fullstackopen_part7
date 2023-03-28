import { createSlice } from '@reduxjs/toolkit'

const timeoutSlice = createSlice({
    name: 'timeout',
    initialState: '',
    reducers: {
        setTimeoutId(state, action) {
            return (state = action.payload)
        },
        resetTimeout(state, action) {
            clearTimeout(state)
            return (state = '')
        },
    },
})

export const { setTimeoutId, resetTimeout } = timeoutSlice.actions

export default timeoutSlice.reducer
