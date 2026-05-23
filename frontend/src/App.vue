<template>
  <router-view />
</template>

<script setup>
// 路由已经通过 AppLayout 处理，这里只负责渲染路由
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--lb-bg);
  color: var(--lb-text);
  overflow-x: hidden;
}

img {
  display: block;
  max-width: 100%;
}
</style>
