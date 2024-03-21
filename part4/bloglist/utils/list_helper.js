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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}