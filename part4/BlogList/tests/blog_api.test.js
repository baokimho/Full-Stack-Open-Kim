const { test, after, beforeEach } = require('node:test') 
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/blog_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  assert.ok(firstBlog.id)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201) 
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Canonical string reduction'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'TDD is awesome',
    author: 'Robert C. Martin',
    url: 'http://cleancoder.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title Author',
    url: 'http://no-title.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400) 
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL Blog',
    author: 'No URL Author',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400) 
})

test('a specific blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204) 

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const ids = blogsAtEnd.map(r => r.id)
  assert(!ids.includes(blogToDelete.id))
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const blogData = {
    likes: blogToUpdate.likes + 1,
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogData)
    .expect(200) 
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})