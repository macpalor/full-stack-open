const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
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

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert(titles.includes('Canonical string reduction'))
})

test('blogs have property named "id"', async () => {
    const response = await api.get('/api/blogs')
    const haveIds = response.body.filter(blog => Object.hasOwn(blog, 'id'))
    assert.strictEqual(haveIds.length, response.body.length)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'My Blog',
        author: 'John Doe',
        url: 'https://www.myblogurl.com',
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('My Blog'))
})

test.only('if the value of "likes" is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'My Blog',
        author: 'John Doe',
        url: 'https://www.myblogurl.com',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd[blogsAtEnd.length - 1]

    assert.strictEqual(Object.hasOwn(addedBlog, 'likes'), true)
    assert.strictEqual(addedBlog.likes, 0)
})

after(async () => {
    await mongoose.connection.close()
})