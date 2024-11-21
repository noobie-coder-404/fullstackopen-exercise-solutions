const blog = require("../models/blog")
const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {
    
    return blogs.length === 0 ? 0 : blogs.reduce((likes, currentPost) => likes + currentPost.likes,0)
}

const favoriteBlog = (blogs) => {
    let favorite = blogs[0]
    for (const blog of blogs) {
        if (favorite.likes < blog.likes) {
            favorite = blog
        }
    }
    return favorite
}

const mostBlogs = (blogs) => {

    if (blogs.length === 1){
        return {
            author : blogs[0]['author'],
            blogs : 1
        }
    }

    const authors = _.groupBy(blogs, 'author')

    let mostBloggedAuthor = null
    for (const author in authors) {
        authors[author] = authors[author].length
        if (mostBloggedAuthor === null){
            mostBloggedAuthor = author
        } else if(authors[author] > authors[mostBloggedAuthor]){
            mostBloggedAuthor = author
        }
    }
    
    return {
        author: mostBloggedAuthor,
        blogs : authors[mostBloggedAuthor]
    }
    
}

const mostLikes = (blogs) => {

    if (blogs.length === 1){
        return {
            author : blogs[0]['author'],
            likes : blogs[0]['likes']
        }
    }



    const authors = _.groupBy(blogs, 'author')
    
    let mostLikes = 0
    let mostLikedAuthor = null
    for (const author in authors){
        const likes = _.sumBy(authors[author], 'likes')
        if (likes > mostLikes) {
            mostLikes = likes
            mostLikedAuthor = author
        }
        
    }
    return {
        author : mostLikedAuthor,
        likes : mostLikes
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}