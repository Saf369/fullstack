// tests/blog_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')           // Express app
const Blog = require('../models/blog')  // Mongoose Blog model

const api = supertest(app)

// Initial blogs to populate DB before each test
const initialBlogs = [
  { title: 'First Blog', author: 'Author1', url: 'http://first.com', likes: 5 },
  { title: 'Second Blog', author: 'Author2', url: 'http://second.com', likes: 3 }
]

// Clear DB and insert initial blogs before each test
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

// ========================
// 4.8: GET /api/blogs tests
// ========================

// Test 1: GET /api/blogs returns JSON
test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// Test 2: GET /api/blogs returns all blogs
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

// ========================
// 4.9: Unique identifier test
// ========================

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  // Every blog should have 'id' defined and no '_id'
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
    expect(blog._id).not.toBeDefined()
  })
})

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close()
})
