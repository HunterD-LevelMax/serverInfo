<template>
  <div class="card">
    <h2>💾 Дисковое пространство</h2>
    
    <div class="metric">
      <div class="metric-value">{{ data.disk_total || '0' }} GB</div>
      <div class="metric-label">Всего</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">{{ data.disk_used || '0' }} GB</div>
      <div class="metric-label">Использовано ({{ data.disk_used_percent || 0 }}%)</div>
    </div>
    
    <div class="progress-bar">
      <div 
        class="progress-fill"
        :class="progressClass"
        :style="{ width: diskPercent + '%' }"
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

const diskPercent = computed(() => {
  return props.data.disk_used_percent || 0;
});

const progressClass = computed(() => {
  const percent = diskPercent.value;
  if (percent < 50) return 'low';
  if (percent < 80) return 'medium';
  return 'high';
});
</script>
