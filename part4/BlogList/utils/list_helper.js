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
    if (blogs.length === 0) return null

    const reducer = (max, item) => {
        return max.likes > item.likes ? max : item
    }

    return blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0 ) return null 
    return _.chain(blogs)
    .countBy('author')
    .map((count, author) => {
        return { author: author, blogs: count}
    })
    .maxBy('blogs')
    .value()
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  return _.chain(blogs)
    .groupBy('author') 
    .map((authorBlogs, author) => { 
      return { 
        author: author, 
        likes: _.sumBy(authorBlogs, 'likes') 
      }
    })
    .maxBy('likes') 
    .value();
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}