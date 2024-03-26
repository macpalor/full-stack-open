const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}
  
const favoriteBlog = (blogs) => {
    const reducer = (prev, current) => {
        return prev.likes > current.likes 
        ?
        { 
            title: prev.title,
            author: prev.author,
            likes: prev.likes
        } 
        : 
        {
            title: current.title,
            author: current.author,
            likes: current.likes
        }
    }
    return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    
    const blogsByAuthor = _.countBy(blogs, 'author')
    const mostBlogs = _.maxBy(_.keys(blogsByAuthor), (author) => blogsByAuthor[author])
    return { author: mostBlogs, blogs: blogsByAuthor[mostBlogs]}
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const blogsByAuthor = _.groupBy(blogs, 'author')
    const likesByAuthor = _.mapValues(blogsByAuthor, totalLikes)
    const mostLikes = _.maxBy(_.keys(likesByAuthor), (author) => likesByAuthor[author])
    return { author: mostLikes, likes: likesByAuthor[mostLikes]}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}