import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  test('blog renders only title and author', async () => {
    const blog = {
      title: 'blog for testing',
      author: 'fs developer',
      url: 'fullstack.com',
      likes: 5432
    }

    const updateAppComponent = jest.fn()

    const { container } = render(<Blog blog={blog} updateAppComponent={updateAppComponent} />)


    const div = container.querySelector('.briefInfo')
    expect(div).toHaveTextContent(
      'blog for testing'
    )
    expect(div).toHaveTextContent(
      'fs developer'
    )

    expect(div).not.toHaveTextContent(
      'fullstack.com'
    )

    expect(div).not.toHaveTextContent(
      '5432'
    )


  })

  test('url and number of likes are shown when button has been clicked', async () => {
    const blog = {
      title: 'blog for testing',
      author: 'fs developer',
      url: 'fullstack.com',
      likes: 5432
    }

    const { container } = render(<Blog blog={blog} />)


    const div = container.querySelector('.fullInfo')
    expect(div).toHaveTextContent(
      'blog for testing'
    )
    expect(div).toHaveTextContent(
      'fs developer'
    )

    expect(div).toHaveTextContent(
      'fullstack.com'
    )

    expect(div).toHaveTextContent(
      '5432'
    )



  })

  test('if button is clicked twice, then event handler is clicked twice too', async () => {
    const blog = {
      title: 'blog for testing',
      author: 'fs developer',
      url: 'fullstack.com',
      likes: 5432
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} increaseLikes={mockHandler} />)

    const user = userEvent.setup()

    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)


  })

})
