<template>
  <canvas ref="canvasRef" class="floating-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  minOpacity: {
    type: Number,
    default: 0.3
  },
  maxOpacity: {
    type: Number,
    default: 0.5
  }
})

const canvasRef = ref(null)
let animationId = null

const characters = [
  '书', '读', '阅', '墨', '页', '字', '诗', '文', 
  '章', '籍', '卷', '册', '著', '作', '笔', '简',
  '📖', '📚', '📓', '📗', '📘', '📙', '📒', '📕',
  '「', '」', '『', '』', '“', '”', '《', '》',
  '，', '。', '？', '！', '：', '；', '、', '、'
]

class FloatingChar {
  constructor(canvas, ctx, minOpacity, maxOpacity) {
    this.canvas = canvas
    this.ctx = ctx
    this.minOpacity = minOpacity
    this.maxOpacity = maxOpacity
    this.reset()
  }

  reset() {
    this.char = characters[Math.floor(Math.random() * characters.length)]
    this.x = Math.random() * this.canvas.width
    this.y = this.canvas.height + Math.random() * 100
    this.speed = 0.3 + Math.random() * 0.5
    this.fontSize = 14 + Math.random() * 28
    this.opacity = this.minOpacity + Math.random() * (this.maxOpacity - this.minOpacity)
    this.rotation = (Math.random() - 0.5) * 0.6
    this.drift = (Math.random() - 0.5) * 0.3
    this.variation = Math.random() * Math.PI * 2
  }

  update() {
    this.y -= this.speed
    this.x += Math.sin(this.variation) * this.drift
    this.variation += 0.01
    
    if (this.y < -50) {
      this.reset()
    }
  }

  draw() {
    this.ctx.save()
    this.ctx.font = `${this.fontSize}px "SimSun", "STSong", "Songti SC", serif`
    this.ctx.globalAlpha = this.opacity
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(this.rotation)
    this.ctx.fillStyle = '#8B5E3C'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(this.char, 0, 0)
    this.ctx.restore()
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let floatingChars = []

  const resize = () => {
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.scale(dpr, dpr)
    
    const count = 20
    if (floatingChars.length === 0) {
      for (let i = 0; i < count; i++) {
        const char = new FloatingChar(canvas, ctx, props.minOpacity, props.maxOpacity)
        char.y = Math.random() * window.innerHeight
        floatingChars.push(char)
      }
    }
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    floatingChars.forEach(char => {
      char.update()
      char.draw()
    })
    
    animationId = requestAnimationFrame(animate)
  }

  resize()
  animate()

  window.addEventListener('resize', resize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  })
})
</script>

<style scoped>
.floating-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
