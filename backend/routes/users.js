const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const { authenticateToken } = require('../middleware/auth')

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body
    
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone])
    if (result.rows.length === 0) {
      return res.json({ code: 1, message: '用户不存在' })
    }

    const user = result.rows[0]
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return res.json({ code: 1, message: '密码错误' })
    }

    const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '7d' })
    
    res.json({
      code: 0,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          points: user.points,
          email: user.email,
          phone: user.phone
        }
      }
    })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { phone, password, confirmPassword } = req.body
    
    if (password !== confirmPassword) {
      return res.json({ code: 1, message: '两次密码不一致' })
    }

    const existing = await pool.query('SELECT * FROM users WHERE phone = $1', [phone])
    if (existing.rows.length > 0) {
      return res.json({ code: 1, message: '手机号已注册' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const result = await pool.query(
      'INSERT INTO users (phone, password, username, points) VALUES ($1, $2, $3, $4) RETURNING *',
      [phone, hashedPassword, phone, 0]
    )

    res.json({ code: 0, message: '注册成功', data: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id])
    
    if (result.rows.length === 0) {
      return res.json({ code: 1, message: '用户不存在' })
    }

    const user = result.rows[0]
    res.json({
      code: 0,
      data: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        points: user.points,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, address } = req.body
    
    await pool.query(
      'UPDATE users SET username = $1, email = $2, address = $3 WHERE id = $4',
      [username, email, address, req.user.id]
    )

    res.json({ code: 0, message: '更新成功' })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router