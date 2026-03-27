<template>
  <div class="controls">
    <div class="mode-switch">
      <button 
        class="mode-btn" 
        :class="{ active: isRealtime }"
        @click="$emit('mode-change', true)"
      >
        🔄 Реальное время
      </button>
      <button 
        class="mode-btn" 
        :class="{ active: !isRealtime }"
        @click="$emit('mode-change', false)"
      >
        ⏸️ Статичный
      </button>
      <button 
        v-if="!isRealtime"
        class="mode-btn refresh-btn"
        @click="$emit('manual-update')"
      >
        🔄 Обновить
      </button>
    </div>
    
    <div class="interval-control">
      <label>⏱️ Интервал (сек):</label>
      <input 
        type="number" 
        :value="interval"
        @change="handleIntervalChange"
        min="1" 
        max="30" 
        step="1"
      >
      <button @click="applyInterval">Применить</button>
    </div>
    
    <div class="status-info">
      <span class="status-badge">{{ statusText }}</span>
      <span class="update-badge">📊 Обновлений: {{ updateCount }}</span>
    </div>
    
    <ThemeToggle />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ThemeToggle from './ThemeToggle.vue';

const props = defineProps({
  isRealtime: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5
  },
  statusText: {
    type: String,
    default: ''
  },
  updateCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['mode-change', 'interval-change', 'manual-update']);

const localInterval = ref(props.interval);

const handleIntervalChange = (event) => {
  localInterval.value = parseInt(event.target.value, 10);
};

const applyInterval = () => {
  if (localInterval.value >= 1 && localInterval.value <= 30) {
    emit('interval-change', localInterval.value);
  } else {
    alert('Интервал должен быть от 1 до 30 секунд');
    localInterval.value = props.interval;
  }
};
</script>

<style scoped>
.status-badge {
  background: var(--success-gradient);
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 217, 165, 0.3);
}

.update-badge {
  background: var(--accent-gradient);
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.refresh-btn {
  background: var(--success-gradient) !important;
  border-color: var(--success-color) !important;
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #00b894 0%, #00a884 100%) !important;
}
</style>
