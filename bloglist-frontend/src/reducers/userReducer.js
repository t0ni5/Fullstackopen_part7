import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser(state, action) {
            state = action.payload
            return state
        },
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
