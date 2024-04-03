const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('when there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
        // const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
        // const promiseArray = blogObjects.map(blog => blog.save())
        // await Promise.all(promiseArray)
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
    
    describe('addition of a new blog', () => {
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
        
        test('if the value of "likes" is missing, it defaults to 0', async () => {
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
        
        test('blogs without title or url are not added', async () => {
            const newBlog = {
                author: 'John Doe',
                likes: 1
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('viewing a specific blog', () => {
        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, blogToView)
        })

        test('fails with status code 404 if blog does not exist', async () => {
            const validNonExistingId = await helper.nonExistingId()

            await api
                .get(`/api/blogs/${validNonExistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'
      
            await api
              .get(`/api/blogs/${invalidId}`)
              .expect(400)
        })
      
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
            const titles = blogsAtEnd.map(blog => blog.title)
            assert(!titles.includes(blogToDelete.title))
        })
    })

    describe('updating the likes of a blog', () => {
        test('succeeds with status code 200 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToBeUpdated = blogsAtStart[0]
       
            const updatedBlog = {...blogToBeUpdated, likes: blogToBeUpdated.likes + 1}

            await api
                .put(`/api/blogs/${blogToBeUpdated.id}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            const blogAfterUpdate = blogsAtEnd[0]
            assert.strictEqual(blogAfterUpdate.likes, updatedBlog.likes)
        })
    })
    
})

after(async () => {
    await mongoose.connection.close()
})