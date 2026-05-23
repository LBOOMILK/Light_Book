const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const { authenticateToken } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const { book_id, page = 1, limit = 10 } = req.query
    
    let query = 'SELECT r.*, u.username, u.avatar FROM reviews r JOIN users u ON r.user_id = u.id WHERE 1=1'
    const params = []
    let paramCount = 0

    if (book_id && book_id !== '0') {
      paramCount++
      query += ` AND r.book_id = $${paramCount}`
      params.push(book_id)
    }

    paramCount++
    query += ` ORDER BY r.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, (page - 1) * limit)

    const result = await pool.query(query, params)
    res.json({ code: 0, data: result.rows })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { book_id, content, rating } = req.body
    
    const result = await pool.query(
      'INSERT INTO reviews (book_id, user_id, content, rating, is_purchased) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [book_id, req.user.id, content, rating, false]
    )

    res.json({ code: 0, message: '发布成功', data: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET likes = likes + 1 WHERE id = $1', [req.params.id])
    res.json({ code: 0, message: '点赞成功' })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router