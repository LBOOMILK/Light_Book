const express = require('express')
const router = express.Router()
const pool = require('../config/db')

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category_id, type, keyword, sort } = req.query
    
    let query = 'SELECT * FROM books WHERE 1=1'
    const params = []
    let paramCount = 0

    if (category_id) {
      paramCount++
      query += ` AND category_id = $${paramCount}`
      params.push(category_id)
    }

    if (type) {
      paramCount++
      query += ` AND type = $${paramCount}`
      params.push(type)
    }

    if (keyword) {
      paramCount++
      query += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount})`
      params.push(`%${keyword}%`)
    }

    if (sort === 'new') {
      query += ' ORDER BY created_at DESC'
    } else if (sort === 'hot') {
      query += ' ORDER BY sold_count DESC'
    }

    paramCount++
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, (page - 1) * limit)

    const result = await pool.query(query, params)
    res.json({ code: 0, data: result.rows })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id])
    
    if (result.rows.length === 0) {
      return res.json({ code: 1, message: '图书不存在' })
    }

    res.json({ code: 0, data: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router