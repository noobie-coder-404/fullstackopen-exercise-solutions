const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithOneBlog } = require('./sampleBlogs')
const blogs = require('./sampleBlogs').blogs


describe('most blogs', () => {
    test('correctly returns the author with most blogs with number of blogs', ()=> {
        assert.deepStrictEqual(listHelper.mostBlogs(blogs), {author: 'Robert C. Martin', blogs : 3})
    })

    test('correctly returns the only author in a list with a single blog', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {author: 'Edsger W. Dijkstra', blogs: 1})
    })
})