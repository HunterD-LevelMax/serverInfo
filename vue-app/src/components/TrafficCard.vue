<template>
  <div class="card">
    <h2>📡 Сетевой трафик</h2>
    
    <div class="metric">
      <div class="metric-value">{{ data.traffic_in || 0 }} KB/s</div>
      <div class="metric-label">Входящий</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">{{ data.traffic_out || 0 }} KB/s</div>
      <div class="metric-label">Исходящий</div>
    </div>
    
    <div class="info-row">
      <div class="info-label">Всего RX:</div>
      <div class="info-value">{{ data.total_rx || '0 MB' }}</div>
    </div>
    
    <div class="info-row">
      <div class="info-label">Всего TX:</div>
      <div class="info-value">{{ data.total_tx || '0 MB' }}</div>
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
