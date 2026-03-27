<template>
  <div class="card">
    <h2>👥 Уникальные посетители</h2>
    
    <div class="metric">
      <div class="metric-value">{{ uniqueIps.total }}</div>
      <div class="metric-label">Всего уникальных IP</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">{{ uniqueIps.today }}</div>
      <div class="metric-label">Сегодня</div>
    </div>
    
    <div class="metric">
      <div class="metric-value">{{ uniqueIps.current_hour }}</div>
      <div class="metric-label">За последний час</div>
    </div>
    
    <div v-if="uniqueIps.recent && uniqueIps.recent.length" class="recent-ips">
      <div class="info-label" style="margin-top: 15px;">Последние 10 IP:</div>
      <div class="ip-list">
        <div 
          v-for="(ip, index) in uniqueIps.recent" 
          :key="index" 
          class="ip-item"
        >
          📍 {{ ip }}
        </div>
      </div>
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

const uniqueIps = computed(() => {
  return props.data.unique_ips || {
    total: 0,
    today: 0,
    current_hour: 0,
    recent: []
  };
});
</script>
