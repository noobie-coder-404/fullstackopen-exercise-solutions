import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, describe, expect, test, vi } from 'vitest'
describe('<Blog />', () => {
    

    const blog = {
        url : 'test url',
        author: 'test author',
        likes: '20',
        title: 'this is a test blog',
        user : {
            username : 'test-username',
            name:'test user'
        }
    }

    let container
    let updateBlog
    

    beforeEach(()=> {
        updateBlog = vi.fn()
        container = render(<Blog blog={blog} updateBlog={updateBlog}/>).container
    })

    test('renders title and author but not likes and url', () => {

   

    
        const url = container.querySelector('.url')
        const likes = container.querySelector('.likes')
        const titleAuthor = container.querySelector('.title-author')
    
        expect(url).toBeNull()
        expect(likes).toBeNull()
        expect(titleAuthor).toHaveTextContent('this is a test blog')
        expect(titleAuthor).toHaveTextContent('test author')
    
    
    
    })

    test('button press renders shows likes and url', async ()=> {
        const user= userEvent.setup()
        const button = screen.getByText('show')
        await user.click(button)

        const url = container.querySelector('.url')
        const likes = container.querySelector('.likes')
        const titleAuthor = container.querySelector('.title-author')

        expect(url).toHaveTextContent('test url')
        expect(likes).toHaveTextContent('20')
        expect(titleAuthor).toBeNull()
        
    })

    test('clicking like button twice calls the event handler twice', async () => {
       

    

        const user = userEvent.setup()
        const showButton = screen.getByText('show')
        await user.click(showButton)

        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        

        expect(updateBlog.mock.calls).toHaveLength(2)
        

        
    })

})




