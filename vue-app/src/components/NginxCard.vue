<template>
  <div class="card">
    <h2>🌐 Nginx статистика</h2>
    
    <div class="metric">
      <div class="metric-value">{{ data.nginx_active || 0 }}</div>
      <div class="metric-label">Активных соединений</div>
    </div>
    
    <div class="info-row">
      <div class="info-label">Всего запросов:</div>
      <div class="info-value">{{ formatNumber(data.nginx_requests) }}</div>
    </div>
    
    <div class="info-row">
      <div class="info-label">Принято:</div>
      <div class="info-value">{{ formatNumber(data.nginx_accepts) }}</div>
    </div>
    
    <div class="info-row">
      <div class="info-label">Обработано:</div>
      <div class="info-value">{{ formatNumber(data.nginx_handled) }}</div>
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

const formatNumber = (num) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
</script>
