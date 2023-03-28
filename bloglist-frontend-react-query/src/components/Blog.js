import { useState } from 'react'
import '../blog.css'
import blogService from '../services/blogs'

const Blog = ({
  blog,
  updateAppComponent,
  increaseLikes,
  deleteBlogMutation,
}) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showUser = () => {
    if (blog.user) {
      return blog.user.username
    }
  }

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
        deleteBlogMutation.mutate(blog.id)
      } catch (exception) {
        alert('you can delete only your own blogs')
      }
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='brief-info'>
        {blog.title} {blog.author}{' '}
        <button id='toggleButton' onClick={toggleVisibility}>
          view
        </button>
      </div>

      <div style={showWhenVisible} className='full-info'>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        <span className='like-span'>
          likes {blog.likes}{' '}
          <button
            className='like-button'
            onClick={() => increaseLikes(blog.id)}
          >
            like
          </button>{' '}
        </span>{' '}
        <br />
        {showUser()}
        {showRemoveButton()}
      </div>
    </div>
  )
}

export default Blog
