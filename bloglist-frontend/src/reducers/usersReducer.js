import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        setUsers(state, action) {
            state = action.payload
            return state
        },
    },
})

export const { setUsers } = usersSlice.actions

export default usersSlice.reducer
