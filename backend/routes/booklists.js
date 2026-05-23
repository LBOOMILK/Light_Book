const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const { authenticateToken } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM booklists ORDER BY created_at DESC')
    res.json({ code: 0, data: result.rows })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, books } = req.body
    
    const result = await pool.query(
      'INSERT INTO booklists (user_id, title, description, books) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, description, books || '{}']
    )

    res.json({ code: 0, message: '创建成功', data: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router