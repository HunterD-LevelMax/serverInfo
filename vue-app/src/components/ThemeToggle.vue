<template>
  <button 
    class="theme-toggle" 
    @click="toggleTheme"
    :title="isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
  >
    <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
    <span class="theme-text">{{ isDark ? 'Светлая' : 'Тёмная' }}</span>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js';

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--button-bg);
  color: var(--button-text);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.theme-toggle:hover {
  background: var(--button-hover);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px var(--shadow-color);
}

.theme-toggle:active {
  transform: translateY(-1px) scale(1.02);
}

.theme-icon {
  font-size: 18px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.theme-text {
  font-size: 13px;
  letter-spacing: 0.3px;
}

@media (max-width: 768px) {
  .theme-text {
    display: none;
  }
  
  .theme-toggle {
    padding: 10px 14px;
  }
}
</style>
