const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/blog_list_populate')

const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash: 'secret'
    })
    await newUser.save()
  })

  test('a new blog is linked to the creator user', async () => {
    const usersAtStart = await helper.usersInDb()
    const creatorUser = usersAtStart[0]

    const newBlog = {
      title: 'Test Blog for Population',
      author: 'Tester',
      url: 'https://test.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 1)
    assert.strictEqual(blogsAtEnd[0].user.toString(), creatorUser.id)
    const usersAtEnd = await helper.usersInDb()

    const userAfterCreation = usersAtEnd[0]
    
    assert.strictEqual(userAfterCreation.blogs.length, 1)
    assert.strictEqual(userAfterCreation.blogs[0].toString(), blogsAtEnd[0].id)
  })

  test('GET /api/blogs populates user information', async () => {
    const blog = new Blog({
      title: 'Populate me',
      author: 'Author',
      url: 'http://link.com',
      user: (await User.findOne({}))._id
    })
    await blog.save()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    assert.strictEqual(typeof blogs[0].user, 'object')
    assert.strictEqual(blogs[0].user.username, 'root')
  })

  test('GET /api/users populates blogs information', async () => {
    const user = await User.findOne({})
    const blog = new Blog({ title: 'User blog', author: 'A', url: 'B', user: user._id })
    const savedBlog = await blog.save()
    
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const response = await api
      .get('/api/users')
      .expect(200)

    const users = response.body
    assert.strictEqual(users[0].blogs.length, 1)
    assert.strictEqual(users[0].blogs[0].title, 'User blog')
  })

  after(async () => {
    await mongoose.connection.close()
  })
})