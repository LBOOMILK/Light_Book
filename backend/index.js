require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', require('./routes/users'))
app.use('/api/books', require('./routes/books'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/reviews', require('./routes/reviews'))
app.use('/api/booklists', require('./routes/booklists'))

app.get('/', (req, res) => {
  res.json({ message: 'Light Book API is running!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})