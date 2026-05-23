const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const { authenticateToken } = require('../middleware/auth')

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cart WHERE user_id = $1', [req.user.id])
    res.json({ code: 0, data: result.rows })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { book_id, quantity = 1 } = req.body
    
    const existing = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND book_id = $2', [req.user.id, book_id])
    
    if (existing.rows.length > 0) {
      await pool.query('UPDATE cart SET quantity = quantity + $1 WHERE id = $2', [quantity, existing.rows[0].id])
      res.json({ code: 0, message: '已添加到购物车' })
    } else {
      const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [book_id])
      const book = bookResult.rows[0]
      
      await pool.query(
        'INSERT INTO cart (user_id, book_id, title, cover, price, quantity) VALUES ($1, $2, $3, $4, $5, $6)',
        [req.user.id, book_id, book.title, book.cover, book.price, quantity]
      )
      
      res.json({ code: 0, message: '已添加到购物车' })
    }
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body
    
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    } else {
      await pool.query('UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3', [quantity, req.params.id, req.user.id])
    }
    
    res.json({ code: 0, message: '更新成功' })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    res.json({ code: 0, message: '删除成功' })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router