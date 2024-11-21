const {test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const {blogs, listWithNoBlogs, listWithOneBlog} = require('./sampleBlogs')


describe('total likes', () => {
    

      test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
      })

      test('of many blogs is calculated correctly', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 36)
      })

      test('of list with on blog is zero', () => {
        assert.strictEqual(listHelper.totalLikes(listWithNoBlogs), 0)
      })
  
  })
