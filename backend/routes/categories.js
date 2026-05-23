const express = require('express')
const router = express.Router()
const pool = require('../config/db')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE parent_id = 0 ORDER BY sort_order')
    res.json({ code: 0, data: result.rows })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.get('/:id/children', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE parent_id = $1 ORDER BY sort_order', [req.params.id])
    res.json({ code: 0, data: result.rows })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router