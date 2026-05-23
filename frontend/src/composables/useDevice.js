import { ref, onMounted, onUnmounted } from 'vue'

const BREAKPOINT = 768

const isMobile = ref(window.innerWidth < BREAKPOINT)
const screenWidth = ref(window.innerWidth)

let listenerCount = 0
let handler = null

function update() {
  screenWidth.value = window.innerWidth
  isMobile.value = window.innerWidth < BREAKPOINT
}

export function useDevice() {
  onMounted(() => {
    if (listenerCount === 0) {
      handler = () => update()
      window.addEventListener('resize', handler)
    }
    listenerCount++
    update()
  })

  onUnmounted(() => {
    listenerCount--
    if (listenerCount <= 0 && handler) {
      window.removeEventListener('resize', handler)
      handler = null
      listenerCount = 0
    }
  })

  return {
    isMobile,
    isDesktop: computed(() => !isMobile.value),
    screenWidth
  }
}
