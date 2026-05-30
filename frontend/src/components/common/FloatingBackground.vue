<template>
  <canvas ref="canvasRef" class="floating-bg"></canvas>
</template>

<script setup>import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps({
 minOpacity: {
 type: Number,
 default: 0.18
 },
 maxOpacity: {
 type: Number,
 default: 0.3
 },
 minFontSize: {
 type: Number,
 default: 14
 },
 maxFontSize: {
 type: Number,
 default: 42
 },
 minSpeed: {
 type: Number,
 default: 0.3
 },
 maxSpeed: {
 type: Number,
 default: 0.8
 },
 charCount: {
 type: Number,
 default: 20
 },
 charColor: {
 type: String,
 default: '#8B5E3C'
 },
 direction: {
 type: String,
 default: 'up',
 validator: (val) => ['up', 'down'].includes(val)
 },
 enableDrift: {
 type: Boolean,
 default: true
 },
 maxRotation: {
 type: Number,
 default: 0.6
 },
 fontFamily: {
 type: String,
 default: '"SimSun", "STSong", "Songti SC", serif'
 }
});
const canvasRef = ref(null);
let animationId = null;
const characters = [
 '书', '读', '阅', '墨', '页', '字', '诗', '文',
 '章', '籍', '卷', '册', '著', '作', '笔', '简',
 '📖', '📚', '📓', '📗', '📘', '📙', '📒', '📕',
 '「', '」', '『', '』', '“', '”', '《', '》',
 '，', '。', '？', '！', '：', '；', '、', '·'
];
class FloatingChar {
 constructor(canvas, ctx, options) {
 this.canvas = canvas;
 this.ctx = ctx;
 this.options = options;
 this.reset();
 }
 reset() {
 const { minOpacity, maxOpacity, minFontSize, maxFontSize, minSpeed, maxSpeed, direction, enableDrift, maxRotation } = this.options;
 this.char = characters[Math.floor(Math.random() * characters.length)];
 this.x = Math.random() * this.canvas.width;
 this.y = direction === 'down' ? -50 : this.canvas.height + Math.random() * 100;
 this.speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
 this.fontSize = minFontSize + Math.random() * (maxFontSize - minFontSize);
 this.opacity = minOpacity + Math.random() * (maxOpacity - minOpacity);
 this.rotation = (Math.random() - 0.5) * maxRotation;
 this.drift = enableDrift ? (Math.random() - 0.5) * 0.3 : 0;
 this.variation = Math.random() * Math.PI * 2;
 this.direction = direction;
 }
 update() {
 if (this.direction === 'up') {
 this.y -= this.speed;
 }
 else {
 this.y += this.speed;
 }
 this.x += Math.sin(this.variation) * this.drift;
 this.variation += 0.01;
 const canvasHeight = this.canvas.height;
 if (this.direction === 'up' && this.y < -50) {
 this.y = canvasHeight + Math.random() * 100;
 }
 else if (this.direction === 'down' && this.y > canvasHeight + 50) {
 this.y = -50;
 }
 }
 draw() {
 const { charColor, fontFamily } = this.options;
 this.ctx.save();
 this.ctx.font = `${this.fontSize}px ${fontFamily}`;
 this.ctx.globalAlpha = this.opacity;
 this.ctx.translate(this.x, this.y);
 this.ctx.rotate(this.rotation);
 this.ctx.fillStyle = charColor;
 this.ctx.textAlign = 'center';
 this.ctx.textBaseline = 'middle';
 this.ctx.fillText(this.char, 0, 0);
 this.ctx.restore();
 }
}
onMounted(() => {
 const canvas = canvasRef.value;
 if (!canvas)
 return;
 const ctx = canvas.getContext('2d');
 let floatingChars = [];
 const resize = () => {
 const dpr = window.devicePixelRatio || 1;
 canvas.width = window.innerWidth * dpr;
 canvas.height = window.innerHeight * dpr;
 canvas.style.width = `${window.innerWidth}px`;
 canvas.style.height = `${window.innerHeight}px`;
 ctx.scale(dpr, dpr);
 if (floatingChars.length === 0) {
 for (let i = 0; i < props.charCount; i++) {
 const char = new FloatingChar(canvas, ctx, props);
 char.y = Math.random() * window.innerHeight;
 floatingChars.push(char);
 }
 }
 };
 const animate = () => {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 floatingChars.forEach(char => {
 char.update();
 char.draw();
 });
 animationId = requestAnimationFrame(animate);
 };
 resize();
 animate();
 window.addEventListener('resize', resize);
 onUnmounted(() => {
 window.removeEventListener('resize', resize);
 if (animationId) {
 cancelAnimationFrame(animationId);
 }
 });
});
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
