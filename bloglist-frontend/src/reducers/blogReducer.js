import { createSlice } from '@reduxjs/toolkit'
import { resetTimeout, setTimeoutId } from './timeoutReducer'
import blogService from '../services/blogs'

const blogsSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        addBlog(state, action) {
            state.push(action.payload)
        },
        setBlogs(state, action) {
            return action.payload
        },
        likeBlog(state, action) {
            const id = action.payload
            const blogToChange = state.find((b) => b.id === id)

            const changedBlog = {
                ...blogToChange,
                likes: blogToChange.likes + 1,
            }

            return state.map((blog) => (blog.id !== id ? blog : changedBlog))
        },
        deleteBlog(state, action) {
            const id = action.payload
            const blogToDelete = state.find((b) => b.id === id)

            return state.filter((blog) => blog.id !== id)
        },
        addCommentary(state, action) {
            console.log(action.payload)
            const id = action.payload.id
            const content = action.payload.content

            console.log(id, content)

            const blogToComment = state.find((b) => b.id === id)

            const commentedBlog = {
                ...blogToComment,
                comments: blogToComment.comments.concat(content),
            }

            return state.map((blog) => (blog.id !== id ? blog : commentedBlog))
        },
    },
})

export const { addBlog, setBlogs, likeBlog, deleteBlog, addCommentary } =
    blogsSlice.actions

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
    }
}

export const createBlog = (newObject) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(newObject)
        dispatch(addBlog(newBlog))
    }
}

export default blogsSlice.reducer
