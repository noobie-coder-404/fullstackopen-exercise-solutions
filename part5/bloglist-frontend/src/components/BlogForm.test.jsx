
import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { beforeEach, describe, expect, test, vi } from 'vitest'


describe('<BlogForm />', () => {
    test('blog form calls the event handler with right details', async() => {
        const createBlog = vi.fn()
        const container = render(<BlogForm createBlog={createBlog} />).container

        const user = userEvent.setup()

        const submitButton = screen.getByText('Add')
        const urlForm = container.querySelector('[name = "url"]')
        const authorForm = container.querySelector('[name = "author"]')
        const titleForm = container.querySelector('[name="title"]')

        const blog = {
            url: 'test url',
            title: 'test blog',
            author: 'test author'
        }

        await user.type(urlForm, blog.url)
        await user.type(titleForm,  blog.title)
        await user.type(authorForm, blog.author)
        await user.click(submitButton)

        expect(createBlog.mock.calls[0][0]).toStrictEqual(blog)
        console.log(createBlog.mock.calls)

    
    })
})