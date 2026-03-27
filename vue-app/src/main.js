import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'
import { useTheme } from './composables/useTheme.js'

// Initialize theme before mounting the app
const { initTheme } = useTheme()
initTheme()

createApp(App).mount('#app')
