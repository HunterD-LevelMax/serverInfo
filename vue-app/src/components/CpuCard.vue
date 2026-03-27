<template>
  <div class="card">
    <h2>💻 Нагрузка CPU</h2>
    
    <div class="metric">
      <div class="metric-value">{{ data.load_1min || '0.00' }}</div>
      <div class="metric-label">За 1 минуту</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">{{ data.load_5min || '0.00' }}</div>
      <div class="metric-label">За 5 минут</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">{{ data.load_15min || '0.00' }}</div>
      <div class="metric-label">За 15 минут</div>
    </div>
    
    <div v-if="data.temperature" class="info-row">
      <div class="info-label">🌡️ Температура:</div>
      <div class="info-value">{{ data.temperature }}°C</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>
