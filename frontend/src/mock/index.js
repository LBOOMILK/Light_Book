/**
 * 本地 Mock 数据 — 后端接好后删除此文件即可
 */

export const mockCategories = [
  { id: 1, name: '文学小说', icon: '📖' },
  { id: 2, name: '社科历史', icon: '📜' },
  { id: 3, name: '科技编程', icon: '💻' },
  { id: 4, name: '艺术设计', icon: '🎨' },
  { id: 5, name: '商业管理', icon: '💼' },
  { id: 6, name: '生活休闲', icon: '🌿' },
  { id: 7, name: '教育考试', icon: '🎓' },
  { id: 8, name: '童书绘本', icon: '🧸' },
  { id: 9, name: '漫画动漫', icon: '🖼️' },
  { id: 10, name: '全部分类', icon: '📂' }
]

export const mockBooks = [
  {
    id: '1',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    publisher: '南海出版公司',
    price: 45.00,
    original_price: 59.90,
    cover: '',
    isbn: '978-7-5442-6018-8',
    stock: 128,
    type: 'paper',
    description: '《百年孤独》是魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰，反映了拉丁美洲一个世纪以来风云变幻的历史。'
  },
  {
    id: '2',
    title: '三体',
    author: '刘慈欣',
    publisher: '重庆出版社',
    price: 36.00,
    original_price: 56.00,
    cover: '',
    isbn: '978-7-5366-9293-0',
    stock: 256,
    type: 'paper',
    description: '文化大革命如火如荼进行的同时，军方探寻外星文明的绝密计划"红岸工程"取得了突破性进展。但在按下发射键的那一刻，历经劫难的叶文洁没有意识到，她彻底改变了人类的命运。'
  },
  {
    id: '3',
    title: 'JavaScript高级程序设计',
    author: 'Matt Frisbie',
    publisher: '人民邮电出版社',
    price: 89.00,
    original_price: 129.00,
    cover: '',
    isbn: '978-7-115-54532-4',
    stock: 89,
    type: 'paper',
    description: '本书是JavaScript经典图书的新版，涵盖了ECMAScript 2019及更新版本的新功能，全面、深入地介绍了JavaScript开发者必须掌握的前端开发技术。'
  },
  {
    id: '4',
    title: '小王子',
    author: '安托万·德·圣-埃克苏佩里',
    publisher: '人民文学出版社',
    price: 22.00,
    original_price: 32.00,
    cover: '',
    isbn: '978-7-0201-0382-5',
    stock: 500,
    type: 'paper',
    description: '小王子是一个超凡脱俗的仙童，他住在一颗只比他大一丁点儿的小行星上。陪伴他的是一朵他非常喜爱的小玫瑰花。但玫瑰花的虚荣心伤害了小王子对她的感情。'
  },
  {
    id: '5',
    title: '活着',
    author: '余华',
    publisher: '作家出版社',
    price: 28.00,
    original_price: 39.50,
    cover: '',
    isbn: '978-7-5063-6052-8',
    stock: 320,
    type: 'paper',
    description: '地主少爷福贵嗜赌成性，终于赌光了家业。穷困之中的福贵因为母亲生病前去求医，没想到半路上被国民党部队抓了壮丁，后被解放军所俘虏，回到家乡他才知道母亲已经过世。'
  },
  {
    id: '6',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    publisher: '中信出版社',
    price: 48.00,
    original_price: 68.00,
    cover: '',
    isbn: '978-7-5086-4735-7',
    stock: 180,
    type: 'ebook',
    description: '十万年前，地球上至少有六种不同的人。但今天，世界舞台为什么只剩下了我们自己？尤瓦尔·赫拉利用一种全新的视角，审视人类的历史。'
  },
  {
    id: '7',
    title: '设计心理学',
    author: '唐纳德·诺曼',
    publisher: '中信出版社',
    price: 52.00,
    original_price: 72.00,
    cover: '',
    isbn: '978-7-5086-4833-0',
    stock: 95,
    type: 'paper',
    description: '诺曼博士用诙谐的语言讲述了许多我们日常生活中常常会遇到的挫折和危险，帮我们找到了这些问题的关键。'
  },
  {
    id: '8',
    title: '深入理解计算机系统',
    author: 'Randal E. Bryant',
    publisher: '机械工业出版社',
    price: 109.00,
    original_price: 139.00,
    cover: '',
    isbn: '978-7-111-54493-7',
    stock: 67,
    type: 'paper',
    description: '和第2版相比，本版内容上最大的变化是，从以IA32和x86-64为基础转变为完全以x86-64为基础，还更新了更多的现实世界的例子。'
  },
  {
    id: '9',
    title: '月亮与六便士',
    author: '毛姆',
    publisher: '上海译文出版社',
    price: 32.00,
    original_price: 45.00,
    cover: '',
    isbn: '978-7-5327-6584-8',
    stock: 210,
    type: 'ebook',
    description: '一个英国证券交易所的经纪人，本已有牢靠的职业和地位、美满的家庭，但却迷恋上绘画，像"被魔鬼附了体"，突然弃家出走，到巴黎去追求绘画的理想。'
  },
  {
    id: '10',
    title: 'Vue.js设计与实现',
    author: '霍春阳',
    publisher: '人民邮电出版社',
    price: 79.00,
    original_price: 99.00,
    cover: '',
    isbn: '978-7-115-58322-3',
    stock: 150,
    type: 'paper',
    description: '本书基于Vue.js 3，深入解构Vue.js的设计与实现，讲解了Vue.js的核心模块、响应式原理、虚拟DOM、编译器等。'
  }
]

export const mockUser = {
  id: 1,
  username: 'LightReader',
  avatar: '',
  points: 260,
  email: 'reader@lightbook.com',
  phone: '13800138000'
}

export const mockOrders = [
  {
    id: '1',
    order_no: 'LB20260523001',
    status: 'pending',
    total_amount: 81.00,
    created_at: '2026-05-23 10:30',
    items: [
      { id: '1', title: '百年孤独', cover: '', price: 45.00, quantity: 1 },
      { id: '5', title: '活着', cover: '', price: 28.00, quantity: 1 }
    ]
  },
  {
    id: '2',
    order_no: 'LB20260522002',
    status: 'shipped',
    total_amount: 89.00,
    created_at: '2026-05-22 14:20',
    items: [
      { id: '3', title: 'JavaScript高级程序设计', cover: '', price: 89.00, quantity: 1 }
    ]
  },
  {
    id: '3',
    order_no: 'LB20260520003',
    status: 'completed',
    total_amount: 113.00,
    created_at: '2026-05-20 09:15',
    items: [
      { id: '8', title: '深入理解计算机系统', cover: '', price: 109.00, quantity: 1 }
    ]
  }
]

export const mockReviews = [
  {
    id: '1',
    content: '马尔克斯笔下的马孔多小镇，像一场漫长的梦。读完久久不能平静，每个人物都像是命运的棋子，却又有自己的挣扎和温度。',
    rating: 5,
    likes: 42,
    created_at: '2026-05-20',
    user: { username: '书虫小王', avatar: '' }
  },
  {
    id: '2',
    content: '第二遍读了，每次都有新的感受。魔幻现实主义的魅力就在于，你知道它是假的，但你愿意相信。',
    rating: 5,
    likes: 28,
    created_at: '2026-05-18',
    user: { username: '深夜读者', avatar: '' }
  },
  {
    id: '3',
    content: '前50页有点难啃，人物名字太多容易混。但坚持过去之后就停不下来了，强烈推荐。',
    rating: 4,
    likes: 15,
    created_at: '2026-05-15',
    user: { username: '慢热型', avatar: '' }
  }
]

export const mockBooklists = [
  {
    id: '1',
    title: '程序员必读经典',
    description: '提升内功的计算机经典书籍',
    cover: '',
    book_count: 8
  },
  {
    id: '2',
    title: '睡前轻松读物',
    description: '不费脑子的轻松好书',
    cover: '',
    book_count: 12
  },
  {
    id: '3',
    title: '2026年度推荐',
    description: '今年读过最值得推荐的书',
    cover: '',
    book_count: 6
  }
]

/**
 * 生成封面占位 SVG（暖色调 + 书名首字）
 */
export function generateCover(title = '', seed = 0) {
  const colors = [
    ['#8B5E3C', '#D4A574'],
    ['#6B4226', '#E8B86D'],
    ['#A0522D', '#DEB887'],
    ['#704214', '#C8A882'],
    ['#5C3317', '#B8860B']
  ]
  const [c1, c2] = colors[seed % colors.length]
  const char = title.charAt(0) || '📖'
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="120" height="160" rx="8" fill="url(#g)"/><text x="60" y="75" text-anchor="middle" fill="#fff" font-size="28" font-family="serif">${char}</text><text x="60" y="105" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="10" font-family="sans-serif">${title.slice(0, 6)}</text></svg>`)}`
}

/**
 * 给 mock 数据填充生成封面
 */
export function fillCovers(items) {
  return items.map((item, i) => ({
    ...item,
    cover: item.cover || generateCover(item.title, i)
  }))
}
