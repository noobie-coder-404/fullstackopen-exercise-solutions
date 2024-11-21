const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const {blogs, listWithNoBlogs, listWithOneBlog} = require('./sampleBlogs')

describe('most likes', () => {
    test('returns author with most likes in an array of blogs', () => {
        assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: 'Edsger W. Dijkstra', likes: 17 })
    })

    test('returns the only author in an array containing a single blog', () => {
        assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {author: 'Edsger W. Dijkstra', likes: 5})
    })
})
