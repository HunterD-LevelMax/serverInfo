<template>
  <div class="card">
    <h2>🧠 Оперативная память</h2>
    
    <div class="metric">
      <div class="metric-value">{{ data.memory_total || '0' }} GB</div>
      <div class="metric-label">Всего</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">{{ data.memory_used || '0' }} GB</div>
      <div class="metric-label">Использовано ({{ data.memory_used_percent || 0 }}%)</div>
    </div>
    
    <div class="progress-bar">
      <div 
        class="progress-fill"
        :class="progressClass"
        :style="{ width: memoryPercent + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const memoryPercent = computed(() => {
  return props.data.memory_used_percent || 0;
});

const progressClass = computed(() => {
  const percent = memoryPercent.value;
  if (percent < 50) return 'low';
  if (percent < 80) return 'medium';
  return 'high';
});
</script>
