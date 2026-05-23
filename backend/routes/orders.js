const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const { authenticateToken } = require('../middleware/auth')

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, total_amount, use_points } = req.body
    
    let finalTotal = parseFloat(total_amount)
    let pointsUsed = 0
    
    if (use_points) {
      const userResult = await pool.query('SELECT points FROM users WHERE id = $1', [req.user.id])
      const userPoints = userResult.rows[0].points
      
      if (userPoints >= 100) {
        const maxDeduct = Math.floor(finalTotal * 0.01)
        const availableDeduct = Math.floor(userPoints / 10)
        pointsUsed = Math.min(maxDeduct, availableDeduct)
        finalTotal -= pointsUsed
        
        await pool.query('UPDATE users SET points = points - $1 WHERE id = $2', [pointsUsed * 10, req.user.id])
        
        await pool.query(
          'INSERT INTO points_log (user_id, type, amount, description) VALUES ($1, $2, $3, $4)',
          [req.user.id, 'spend', -pointsUsed * 10, '订单抵扣']
        )
      }
    }

    const orderNo = 'LB' + Date.now() + Math.random().toString(36).slice(-4).toUpperCase()
    
    const result = await pool.query(
      'INSERT INTO orders (user_id, order_no, total_amount, status, expire_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, orderNo, finalTotal, 'pending', new Date(Date.now() + 10 * 60 * 1000)]
    )

    const orderId = result.rows[0].id

    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, book_id,