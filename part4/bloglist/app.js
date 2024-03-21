// require('dotenv').config()
// const express = require('express')
// const app = express()
// const cors = require('cors')
// const mongoose = require('mongoose')

// const blogSchema = new mongoose.Schema({
//     title: String,
//     author: String,
//     url: String,
//     likes: Number
// })

// const Blog = mongoose.model('Blog', blogSchema)

// const mongoUrl = process.env.MONGODB_URI
// //mongoose.set('strictQuery',false)

// mongoose.connect(mongoUrl)
//     .then(() =>{
//         console.log(`Connected to ${mongoUrl}`)
//     })
//     .catch(error => {
//         console.log('Error connecting to server:', error.message)
//     })

// app.use(cors())
// app.use(express.json())

// app.get('/api/blogs', (request, response) => {
//     Blog
//     .find({})
//     .then(blogs => {
//         response.json(blogs)
//     })
// })

// app.post('/api/blogs', (request, response) => {
//     const blog = new Blog(request.body)

//     blog
//     .save()
//     .then(result => {
//         response.status(201).json(result)
//     })
// })
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app