import { useState, useEffect, useRef, useReducer } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import UserContext from './UserContext'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [updateComponent, setUpdateComponent] = useState(true)

  const [notification, notificationDispatch] = useContext(NotificationContext)

  const [user, userDispatch] = useContext(UserContext)

  const queryClient = useQueryClient()

  const result = useQuery('blogs', blogService.getAll)

  const blogs = result.data

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
      console.log('new' + JSON.stringify(newBlog))
    },
  })

  const deleteBlogMutation = useMutation(blogService.deleteBlog, {
    onSuccess: (oldBlog) => {
      queryClient.invalidateQueries('blogs')
    },
    onError: () => {
      alert('you can delete only your own blogs')
    },
  })

  const voteMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const loggedUser = useQuery('loggedUser', () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'SET',
        payload: user,
      })

      blogService.setToken(user.token)
    }
  })

  const updateAppComponent = () => {
    setUpdateComponent(!updateComponent)
  }

  const increaseLikes = async (id) => {
    const blog = blogs.find((b) => b.id === id)

    console.log(blog)

    const changedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }

    voteMutation.mutate({ id: blog.id, changedBlog: changedBlog })
    notificationDispatch({
      type: 'SHOW',
      payload: `blog ${blog.title} by ${blog.author} voted`,
    })
    setTimeout(() => {
      notificationDispatch({ type: 'HIDE' })
    }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit' id='login-button'>
        login
      </button>
    </form>
  )

  const handleBlogCreating = (newObject) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(newObject)

    updateAppComponent()

    notificationDispatch({
      type: 'SHOW',
      payload: `a new blog ${newObject.title} by ${newObject.author} added`,
    })
    setTimeout(() => {
      notificationDispatch({ type: 'HIDE' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({
        type: 'SET',
        payload: user,
      })
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationDispatch({
        type: 'SHOW',
        payload: `wrong username or password`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedUser')
    userDispatch({
      type: 'CLEAR',
    })
    setUsername('')
    setPassword('')
  }

  const blogFormRef = useRef()
  const blogForm = () => (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <CreateBlogForm handleBlogCreating={handleBlogCreating} />
      </Togglable>
    </div>
  )

  if (result.isLoading) {
    return <div> loading data... </div>
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        <p>
          {user.name} logged-in <button onClick={handleLogOut}>logout</button>{' '}
        </p>
      </div>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateAppComponent={updateAppComponent}
          increaseLikes={increaseLikes}
          deleteBlogMutation={deleteBlogMutation}
        />
      ))}
    </div>
  )
}

export default App
