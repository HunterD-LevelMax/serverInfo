<template>
  <div class="card">
    <h2>📌 Основная информация</h2>
    
    <div class="info-row">
      <div class="info-label">Имя сервера:</div>
      <div class="info-value">{{ data.hostname || '—' }}</div>
    </div>
    
    <div class="info-row">
      <div class="info-label">IP сервера:</div>
      <div class="info-value">{{ data.server_ip || '—' }}</div>
    </div>
    
    <div class="info-row">
      <div class="info-label">Ваш IP:</div>
      <div class="info-value">
        <span class="badge badge-info">{{ currentIp }}</span>
      </div>
    </div>
    
    <div class="info-row">
      <div class="info-label">Время работы:</div>
      <div class="info-value">{{ data.uptime || '—' }}</div>
    </div>
    
    <div class="info-row">
      <div class="info-label">Текущее время:</div>
      <div class="info-value">{{ data.server_time || '—' }}</div>
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

const currentIp = computed(() => {
  return props.data.unique_ips?.current || props.data.current_ip || '—';
});
</script>
