const { test, expect, beforeEach, describe } = require('@playwright/test')
const { pseudoRandomBytes } = require('crypto')
const { request } = require('http')
const {loginWith} = require('./helper')
const { log } = require('console')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {

    await request.post('/api/testing/reset')
    await request.post('/api/users', {
        data: {
            "name": "Jim",
            "username": "Jim43452",
            "password": "passwordforjim"
        }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('button', {name:'login'})).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', ()=> {

    test('succeeds with correct credentials', async({page}) => {
        await page.getByTestId('username').fill('Jim43452')
        await page.getByTestId('password').fill('passwordforjim')
        await page.getByRole('button', {name : 'login'}).click()
        await expect(page.getByText('Jim logged in.')).toBeVisible()
        await expect(page.locator('.error')).not.toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
        await page.getByTestId('username').fill('wrong username')
        await page.getByTestId('password').fill('wrong password')
        await page.getByRole('button', {name : 'login'}).click()
        await expect(page.locator('.error')).toContainText('Wrong Credentials')
        await expect(page.getByText('James logged in')).not.toBeVisible()
        
    })
    
   
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
     
        // await page.getByTestId('username').fill('Jim43452')
        // await page.getByTestId('password').fill('passwordforjim')
        // await page.getByRole('button', {name : 'login'}).click()

        await loginWith(page, 'Jim43452', 'passwordforjim')
        
    })
  
    test('a new blog can be created', async ({ page }) => {
        const blog = {
              author: "new author",
              title: "new blog",
              url: "new url"
            }

        await page.getByRole('button', {name : 'add new blog'}).click()
        for (const [key, value] of Object.entries(blog)) {
           
          await page.getByTestId(key).fill(value)
        }
        await page.getByRole('button', {name : 'add'}).click()
        
        
        await expect(page.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
    })

    test('A blog can be liked', async ({page}) => {
        const blogToBeLiked = {
            author: "author",
            title: "blog to test likes",
            url: "url"
          }
        
          await page.getByRole('button', {name : 'add new blog'}).click()
          for (const [key, value] of Object.entries(blogToBeLiked)) {
            await page.getByTestId(key).fill(value)
          }
          await page.getByRole('button', {name : 'add'}).click()

          let blog = await page.getByText('blog to test likes author').locator('..')
          await blog.waitFor() //wait for the blog to render

          await page.getByRole('button', {name: "show"}).click()
          await page.getByRole('button', {name : 'like'}).click()
          await expect(page.getByTestId('likes')).toContainText('1')
          await page.getByRole('button', {name : 'like'}).click()
          await expect(page.getByTestId('likes')).toContainText('2')
    })



    test('A blog can be deleted', async ({page}) => {
      const blogToBeDeleted = {
        author: "author",
        title: "blog to delete",
        url: "url"
      }
    
      await page.getByRole('button', {name : 'add new blog'}).click()
      for (const [key, value] of Object.entries(blogToBeDeleted)) {
        await page.getByTestId(key).fill(value)
      }
      await page.getByRole('button', {name : 'add'}).click()

      let blog = await page.getByText('blog to delete author').locator('..')
      await blog.waitFor() //wait for the blog to render

      await blog.getByRole('button', {name: "show"}).click()
      // blog = await page.getByText('blog to delete').locator('..')
      // await blog.getByRole('button', {name : 'delete'}).click()
      page.on('dialog', async (dialog) => {
        console.log(dialog.message())
        await dialog.accept()
      })
      await page.getByRole('button', {name : 'delete'}).click()
      await expect(page.getByText('\'blog to delete\' by author deleted')).toBeVisible()
      await expect(page.getByText('Blog to delete author', {exact : true})).not.toBeVisible()
      await expect(page.getByText('Blog to delete', {exact : true})).not.toBeVisible()
    
    })
    test('Blogs are arranged in the order of number of likes', async({page}) => {

      

      const blog1 = {
        author : 'author1',
        title : 'title1',
        url : 'url1'
      }

      const blog2 = {
        author : 'author2',
        title : 'title2',
        url : 'url2'
      }

      const blog3 = {
        author : 'author3',
        title : 'title3',
        url : 'url3'
      }

      const blogs = [blog1, blog2, blog3]

      //add the blogs
      let numberOfLikes = 1
    
      for (const blog of blogs){
        
        //add the blog
        await page.getByText('add new blog').click()
        for (const [key, value] of Object.entries(blog)) {
          await page.getByTestId(key).fill(value)
        }
        await page.getByRole('button', {name: 'add'}).click()
        await expect(page.getByText(`${blog.title} ${blog.author}`)).toBeVisible()

        //expand the blog
        let blogLocator = await page.getByText(`${blog.title} ${blog.author}`).locator('..')
        await blogLocator.getByRole('button', {name: "show"}).click()

        for (let i = 0; i < numberOfLikes; i++) {
          blogLocator = await page.getByTestId(`${blog.title}`)
          await blogLocator.getByRole('button', {name : 'like'}).click()
          await expect(blogLocator.getByTestId('likes')).toContainText(`${i+1}`)
          console.log(`${blog.title} liked ${i+1}/${numberOfLikes} times`)
        }
        
        numberOfLikes++
        
      }

      const renderedBlogs = await page.locator('.blog').all()
      expect(renderedBlogs).toHaveLength(3)
      await expect(renderedBlogs[0].getByTestId('likes')).toContainText('3')
      await expect(renderedBlogs[1].getByTestId('likes')).toContainText('2')
      await expect(renderedBlogs[2].getByTestId('likes')).toContainText('1')


    
    })

    
  })

  
})