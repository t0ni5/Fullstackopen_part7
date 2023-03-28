import { useState, useEffect, useRef, useInsertionEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import {
    initializeBlogs,
    createBlog,
    likeBlog,
    deleteBlog,
    addCommentary,
} from './reducers/blogReducer'
import { setUsers } from './reducers/usersReducer'
import { setUser } from './reducers/userReducer'
import { useSelector } from 'react-redux'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
    Navigate,
    useNavigate,
} from 'react-router-dom'
import { Table, Form, Button, Navbar, Nav } from 'react-bootstrap'

const Menu = ({
    blogForm,
    increaseLikes,
    blogs,
    updateAppComponent,
    user,
    handleLogOut,
}) => {
    const padding = {
        padding: 5,
        backgroundColor: '#EAEFEF',
    }

    return (
        <div>
            <div style={padding}>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#" as="span">
                                <Link to="/">blogs</Link>
                            </Nav.Link>
                            <Nav.Link href="#" as="span">
                                <Link to="/users">users</Link>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {user.name} logged-in
                <button onClick={handleLogOut}>logout</button>
            </div>
            <Header user={user} handleLogOut={handleLogOut} />
            <Routes>
                <Route path="/users" element={<Users />} />
                <Route
                    path="/"
                    element={
                        <Home
                            blogForm={blogForm}
                            increaseLikes={increaseLikes}
                            blogs={blogs}
                            updateAppComponent={updateAppComponent}
                        />
                    }
                />
                <Route path="/users/:id" element={<User />} />
                <Route
                    path="/blogs/:id"
                    element={
                        <BlogsDetails
                            increaseLikes={increaseLikes}
                            updateAppComponent={updateAppComponent}
                        />
                    }
                />
            </Routes>
        </div>
    )
}

const BlogsDetails = ({ increaseLikes, updateAppComponent }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const id = useParams().id
    const blogs = useSelector((state) => state.blogs)
    const blog = blogs.find((b) => b.id === id)

    const showRemoveButton = () => {
        if (blog.user)
            return (
                <div>
                    <button onClick={removeBlog}>remove</button>
                </div>
            )
    }

    const removeBlog = async () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
            try {
                await blogService.deleteBlog(blog.id)
                navigate('/')
                dispatch(deleteBlog(blog.id))
            } catch (exception) {
                alert('you can delete only your own blogs')
            }
        }
    }

    const generateId = () => {
        return Number((Math.random() * 1000000).toFixed(0))
    }

    const addComment = async (event) => {
        event.preventDefault()
        const content = event.target.comment.value
        if (content) {
            event.target.comment.value = ''
            try {
                dispatch(addCommentary({ id: blog.id, content: content }))
                await blogService.addComment(blog.id, { comment: content })
            } catch (exception) {
                alert(`Comment can't be empty`)
            }
        }
    }

    if (!blog) {
        return null
    }
    return (
        <div>
            <h1>
                {blog.title} {blog.author}
            </h1>
            <div>
                <a href={`${blog.url}`}>{blog.url}</a>
                <br />
                <span className="like-span">
                    {blog.likes} likes
                    <button
                        className="like-button"
                        onClick={() => increaseLikes(blog)}
                    >
                        like
                    </button>
                    <br></br>
                    {blog.user
                        ? `added by ${blog.user.username}`
                        : 'added by incognito'}
                </span>{' '}
                {showRemoveButton()}
                <div>
                    <h1>comments</h1>
                </div>
                <div>
                    <form onSubmit={addComment}>
                        <input name="comment" type="text" />
                        <button type="submit">add comment</button>
                    </form>
                </div>
                <div>
                    {blog.comments.map((com) => (
                        <li key={generateId()}>{com}</li>
                    ))}
                </div>
            </div>
        </div>
    )
}

const User = () => {
    const id = useParams().id
    const users = useSelector((state) => state.users)
    const user = users.find((u) => u.id === id)

    if (!user) {
        return null
    }
    return (
        <div>
            <h1>{user.username} </h1>
            <div>
                <h2>added blogs</h2>
                {user.blogs.map((blog) => (
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </div>
        </div>
    )
}

const Users = () => {
    const dispatch = useDispatch()
    const users = useSelector((state) => state.users)
    useEffect(() => {
        userService.getAll().then((allUsers) => dispatch(setUsers(allUsers)))
    }, [])
    return (
        <div>
            <h2>Users</h2>
            <Table striped hover>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.username}
                                </Link>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.username}
                                </Link>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    )
}

const Header = ({ user, handleLogOut }) => {
    return (
        <div>
            <h2>blog app</h2>
            <Notification />
            {/* <div>
                <p>
                    {user.name} logged-in
                    <button onClick={handleLogOut}>logout</button>
                </p>
            </div> */}
        </div>
    )
}

const Home = ({ blogForm, blogs, updateAppComponent, increaseLikes }) => {
    return (
        <div>
            {/* {blogForm()}

            {blogs.map((blog) => (
                <Link to={`/blogs/${blog.id}`} key={blog.id}>
                    <Blog blog={blog} />
                </Link>
            ))} */}

            {blogForm()}
            <Table striped hover bordered size="sm">
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog.id}>
                            <td>
                                <Link to={`/blogs/${blog.id}`} key={blog.id}>
                                    {blog.title}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/blogs/${blog.id}`} key={blog.id}>
                                    {blog.author}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

const App = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [updateComponent, setUpdateComponent] = useState(true)
    const dispatch = useDispatch()
    const blogs = useSelector((state) => state.blogs)
    const user = useSelector((state) => state.user)

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [updateComponent])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user))
            blogService.setToken(user.token)
        }
    }, [])

    const updateAppComponent = () => {
        setUpdateComponent(!updateComponent)
    }

    const increaseLikes = async (blog) => {
        const blogToChange = blogs.find((b) => b.id === blog.id)

        const changedBlog = {
            ...blogToChange,
            likes: blogToChange.likes + 1,
            user: blogToChange.user.id,
        }
        await blogService.update(blogToChange.id, changedBlog)

        dispatch(setNotification(`${blog.title} voted`, 5))
        dispatch(likeBlog(blog.id))
    }

    const loginForm = () => (
        <Form onSubmit={handleLogin}>
            <Form.Group>
                <div>
                    <Form.Label>username </Form.Label>
                    <Form.Control
                        id="username"
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    <Form.Label> password </Form.Label>
                    <Form.Control
                        id="password"
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <Button type="submit" id="login-button" variant="success">
                    login
                </Button>
            </Form.Group>
        </Form>
    )

    const handleBlogCreating = (newObject) => {
        console.log(newObject)

        blogFormRef.current.toggleVisibility()
        dispatch(createBlog(newObject))

        dispatch(
            setNotification(
                `a new blog ${newObject.title} by ${newObject.author} added`,
                5
            )
        )
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
            dispatch(setUser(user))
            setUsername('')
            setPassword('')
        } catch (exception) {
            dispatch(setNotification(`wrong username or password`, 5))
        }
    }

    const handleLogOut = () => {
        window.localStorage.removeItem('loggedUser')
        dispatch(setUser(null))
        setUsername('')
        setPassword('')
    }

    const blogFormRef = useRef()
    const blogForm = () => (
        <div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <CreateBlogForm handleBlogCreating={handleBlogCreating} />
            </Togglable>
        </div>
    )

    if (user === null) {
        return (
            <div className="container">
                <h2>Log in to application</h2>
                <Notification />
                {loginForm()}
            </div>
        )
    }

    return (
        <div className="container">
            {/* <Header user={user} handleLogOut={handleLogOut} /> */}
            <Menu
                blogForm={blogForm}
                blogs={blogs}
                increaseLikes={increaseLikes}
                updateAppComponent={updateAppComponent}
                user={user}
                handleLogOut={handleLogOut}
            />
        </div>
    )
}

export default App
