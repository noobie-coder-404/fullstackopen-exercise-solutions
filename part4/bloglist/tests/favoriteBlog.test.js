const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const {blogs, listWithNoBlogs, listWithOneBlog} = require('./sampleBlogs')


describe('favorite blog', () => {
    test('favorite of many blogs is identified correctly', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
    })
    test('favorite in a list with a single blog is that blog itself', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
    })
})