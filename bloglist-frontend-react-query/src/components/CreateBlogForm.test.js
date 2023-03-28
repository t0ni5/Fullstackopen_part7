import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

describe('<CreateBlogForm />',  () => {

  test('form calls event handler with the right details', async () => {
    const handleBlogCreating = jest.fn()
    const user = userEvent.setup()

    render(<CreateBlogForm handleBlogCreating={handleBlogCreating} />)

    const inputTitle = screen.getByPlaceholderText('title')
    const inputAuthor = screen.getByPlaceholderText('author')
    const inputUrl = screen.getByPlaceholderText('url')

    await user.type(inputTitle, 'title for testing the form')
    await user.type(inputAuthor, 'author for testing the form')
    await user.type(inputUrl, 'Url for testing the form')

    const sendButton = screen.getByText('create new')

    await user.click(sendButton)

    expect(handleBlogCreating.mock.calls).toHaveLength(1)
    expect(handleBlogCreating.mock.calls[0][0].title).toBe('title for testing the form')
    expect(handleBlogCreating.mock.calls[0][0].author).toBe('author for testing the form')
    expect(handleBlogCreating.mock.calls[0][0].url).toBe('Url for testing the form')

  })

})



