import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlogForm = ({ handleBlogCreating }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = ({ target }) => {
    setTitle(target.value)
  }

  CreateBlogForm.propTypes = {
    handleBlogCreating: PropTypes.func.isRequired
  }

  const handleAuthorChange = ({ target }) => {
    setAuthor(target.value)
  }

  const handleUrlChange = ({ target }) => {
    setUrl(target.value)
  }

  const handleCreating = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url,
      likes: 0
    }

    handleBlogCreating(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div  className="formDiv">
      <div>
        <h2>Create new blog</h2>
      </div>
      <form onSubmit={handleCreating}>
        <div>
          title
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder='title'
            id='title'
          />
        </div>
        <div>
          author
          <input
            type="text"
            name="author"
            value={author}
            onChange={handleAuthorChange}
            placeholder='author'
            id='author'
          />
        </div>
        <div>
          url
          <input
            type="text"
            name="url"
            value={url}
            onChange={handleUrlChange}
            placeholder='url'
            id='url'
          />
        </div>
        <button type="submit">create new</button>
      </form>
    </div>
  )
}

export default CreateBlogForm