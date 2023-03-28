import { createSlice } from '@reduxjs/toolkit'
import { resetTimeout, setTimeoutId } from './timeoutReducer'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        showNotification(state, action) {
            const content = action.payload
            return (state = content)
        },
        hideNotification(state, action) {
            return (state = '')
        },
    },
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const setNotification = (content, time) => {
    return async (dispatch) => {
        dispatch(resetTimeout())
        dispatch(showNotification(content))

        const id = setTimeout(() => {
            dispatch(hideNotification())
        }, `${time}000`)

        dispatch(setTimeoutId(id))
    }
}

export default notificationSlice.reducer
