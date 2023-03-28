import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const CreateBlogForm = ({ handleBlogCreating }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    console.log()
    const handleTitleChange = ({ target }) => {
        setTitle(target.value)
    }

    CreateBlogForm.propTypes = {
        handleBlogCreating: PropTypes.func.isRequired,
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
            likes: 0,
        }

        handleBlogCreating(newBlog)

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div className="container">
            <div>
                <h2>Create new blog</h2>
            </div>
            <Form onSubmit={handleCreating}>
                <Form.Group>
                    <div>
                        <Form.Label>title </Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="title"
                            id="title"
                        />
                    </div>
                    <div>
                        <Form.Label> author </Form.Label>
                        <Form.Control
                            type="text"
                            name="author"
                            value={author}
                            onChange={handleAuthorChange}
                            placeholder="author"
                            id="author"
                        />
                    </div>
                    <div>
                        <Form.Label> url </Form.Label>
                        <Form.Control
                            type="text"
                            name="url"
                            value={url}
                            onChange={handleUrlChange}
                            placeholder="url"
                            id="url"
                        />
                    </div>
                    <Button variant="success" type="submit">
                        create new
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default CreateBlogForm
