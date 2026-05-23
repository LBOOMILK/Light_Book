-- ================================================
-- Light_Book 在线书店数据库初始化脚本 v1.2
-- 创建日期：2026年5月23日
-- ================================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  points INTEGER DEFAULT 0,
  purchased_ebooks TEXT DEFAULT '[]',
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 分类表
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  icon VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 图书表
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  publisher VARCHAR(100),
  isbn VARCHAR(20),
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  type VARCHAR(20) DEFAULT 'book',
  category_id INTEGER REFERENCES categories(id),
  cover VARCHAR(255),
  description TEXT,
  stock INTEGER DEFAULT 100,
  version INTEGER DEFAULT 1,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 订单表
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  order_no VARCHAR(50) UNIQUE NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  expire_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 订单项表
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  book_id INTEGER REFERENCES books(id),
  title VARCHAR(255) NOT NULL,
  cover VARCHAR(255),
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1
);

-- 7. 购物车表
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  book_id INTEGER REFERENCES books(id),
  title VARCHAR(255) NOT NULL,
  cover VARCHAR(255),
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. 书评表
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id),
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(20) DEFAULT 'content',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  is_purchased BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. 书单表
CREATE TABLE IF NOT EXISTS booklists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  books TEXT DEFAULT '[]',
  is_public BOOLEAN DEFAULT true,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. 退货申请表
CREATE TABLE IF NOT EXISTS returns (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  user_id INTEGER REFERENCES users(id),
  book_id INTEGER REFERENCES books(id),
  quantity INTEGER DEFAULT 1,
  reason VARCHAR(500),
  images TEXT[],
  status VARCHAR(20) DEFAULT 'pending',
  admin_note VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

-- 11. 积分记录表
CREATE TABLE IF NOT EXISTS points_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(20),
  amount INTEGER,
  order_id INTEGER REFERENCES orders(id),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 初始化数据
-- ================================================

-- 插入分类数据
INSERT INTO categories (name, parent_id, sort_order, icon) VALUES 
('文学小说', 0, 1, '📚'),
('科技科普', 0, 2, '🔬'),
('少儿读物', 0, 3, '👶'),
('经济管理', 0, 4, '💰'),
('人文社科', 0, 5, '🧠'),
('中国文学', 1, 1, '🇨🇳'),
('外国文学', 1, 2, '🌍'),
('网络小说', 1, 3, '💻'),
('计算机', 2, 1, '💻'),
('科普读物', 2, 2, '📖'),
('儿童绘本', 3, 1, '🎨'),
('少儿文学', 3, 2, '📚'),
('投资理财', 4, 1, '📈'),
('企业管理', 4, 2, '🏢'),
('历史文化', 5, 1, '🏛️'),
('心理学', 5, 2, '🧠');

-- 插入图书数据
INSERT INTO books (title, author, publisher, isbn, price, original_price, type, category_id, cover, description, stock) VALUES
('活着', '余华', '作家出版社', '9787506358164', 39.00, 45.00, 'book', 6, 'https://via.placeholder.com/200x300?text=活着', '讲述了一个人一生的故事，这是一个历尽世间沧桑和磨难老人的人生感言。', 100),
('三体', '刘慈欣', '重庆出版社', '9787536692930', 68.00, 88.00, 'book', 9, 'https://via.placeholder.com/200x300?text=三体', '地球文明向宇宙发出的第一声啼鸣。', 80),
('小王子', '圣埃克苏佩里', '人民文学出版社', '9787020042509', 32.00, 39.00, 'book', 11, 'https://via.placeholder.com/200x300?text=小王子', '一个来自小行星的王子与飞行员之间的故事。', 150),
('JavaScript高级程序设计', 'Nicholas C. Zakas', '人民邮电出版社', '9787115275790', 129.00, 159.00, 'book', 9, 'https://via.placeholder.com/200x300?text=JS高级', 'JavaScript领域最经典的著作之一。', 50),
('百年孤独', '马尔克斯', '南海出版公司', '9787544244909', 55.00, 68.00, 'book', 7, 'https://via.placeholder.com/200x300?text=百年孤独', '魔幻现实主义文学的代表作。', 60),
('人类简史', '尤瓦尔·赫拉利', '中信出版社', '9787508653883', 68.00, 88.00, 'book', 15, 'https://via.placeholder.com/200x300?text=人类简史', '从十万年前有生命迹象开始到21世纪资本，科技交织的人类发展史。', 70),
('追风筝的人', '卡勒德·胡赛尼', '上海人民出版社', '9787208061644', 36.00, 48.00, 'book', 7, 'https://via.placeholder.com/200x300?text=追风筝的人', '为你，千千万万遍。', 90),
('解忧杂货店', '东野圭吾', '南海出版公司', '9787544270878', 39.50, 49.00, 'book', 8, 'https://via.placeholder.com/200x300?text=解忧杂货店', '现代人内心流失的东西，这家杂货店能帮你找回。', 85);

-- 插入电子书数据
INSERT INTO books (title, author, publisher, isbn, price, original_price, type, category_id, cover, description, stock) VALUES
('活着', '余华', '作家出版社', '9787506358164', 19.90, 39.00, 'ebook', 6, 'https://via.placeholder.com/200x300?text=活着电子书', '电子书版本', 0),
('三体', '刘慈欣', '重庆出版社', '9787536692930', 39.90, 68.00, 'ebook', 9, 'https://via.placeholder.com/200x300?text=三体电子书', '电子书版本', 0),
('小王子', '圣埃克苏佩里', '人民文学出版社', '9787020042509', 12.90, 32.00, 'ebook', 11, 'https://via.placeholder.com/200x300?text=小王子电子书', '电子书版本', 0),
('JavaScript高级程序设计', 'Nicholas C. Zakas', '人民邮电出版社', '9787115275790', 69.90, 129.00, 'ebook', 9, 'https://via.placeholder.com/200x300?text=JS高级电子书', '电子书版本', 0);

-- 插入管理员数据（密码：admin123）
INSERT INTO admins (username, password, role) VALUES
('admin', '$2b$10$EixlY5B3a1OF0.l.zH6kO', 'superadmin');

-- ================================================
-- 测试用户数据
-- ================================================
-- 用户1：测试用户（密码：123456）
-- 用户2：李四（密码：123456）
INSERT INTO users (username, phone, password, points, purchased_ebooks) VALUES
('张三', '13800000001', '$2b$10$8.UnVuG9lhTGn2KLOhFEan', 260, '[]'),
('李四', '13800000002', '$2b$10$8.UnVuG9lhTGn2KLOhFEan', 180, '[1,2]');
