<template>
  <div class="container">
    <h1>
      🖥️ Мониторинг сервера
      <span class="status-online" :class="{ 'status-offline': error }"></span>
    </h1>
    
    <!-- Controls Panel -->
    <ControlsPanel
      :is-realtime="isRealtime"
      :interval="updateInterval"
      :status-text="statusText"
      :update-count="updateCount"
      @mode-change="setMode"
      @interval-change="setIntervalValue"
      @manual-update="fetchData"
    />
    
    <!-- Main Content -->
    <div id="server-data">
      <!-- Loading State -->
      <div v-if="loading && !serverData" class="loader">
        <div class="metric-value">📡</div>
        <div class="metric-label">Загрузка данных...</div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="card">
        <div class="error-message">
          ❌ Ошибка загрузки: {{ error }}
        </div>
      </div>
      
      <!-- Data Display -->
      <template v-else-if="serverData">
        <!-- Main Info Card -->
        <InfoCard :data="serverData" />
        
        <!-- Grid of Metric Cards -->
        <div class="grid">
          <VisitorsCard :data="serverData" />
          <CpuCard :data="serverData" />
          <MemoryCard :data="serverData" />
          <DiskCard :data="serverData" />
          <NginxCard :data="serverData" />
          <TrafficCard :data="serverData" />
        </div>
        
        <!-- Charts Section -->
        <div class="charts-section" v-if="hasHistoryData">
          <h3 class="section-title">📊 История показателей</h3>
          <div class="charts-grid">
            <CpuChart :timestamps="timestamps" :cpu-history="cpuHistory" />
            <MemoryChart :timestamps="timestamps" :memory-history="memoryHistory" />
            <TrafficChart :timestamps="timestamps" :traffic-history="trafficHistory" />
          </div>
        </div>
        
        <!-- Ports Card -->
        <PortsCard :ports="serverData.open_ports" />
        
        <!-- Docker Card -->
        <DockerCard :containers="serverData.docker_containers" />
        
        <!-- Update Time -->
        <div class="update-time">
          Обновлено: {{ serverData.update_time }} ({{ serverData.response_time }} мс)
        </div>
      </template>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>📊 Системный мониторинг | Vue.js Dashboard</p>
      <p style="font-size: 11px; margin-top: 5px;">
        🖥️ Сервер: {{ serverData?.hostname || '—' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useServerMonitor } from './composables/useServerMonitor.js';
import { useServerHistory } from './composables/useServerHistory.js';
import { computed } from 'vue';
import ControlsPanel from './components/ControlsPanel.vue';
import InfoCard from './components/InfoCard.vue';
import VisitorsCard from './components/VisitorsCard.vue';
import CpuCard from './components/CpuCard.vue';
import MemoryCard from './components/MemoryCard.vue';
import DiskCard from './components/DiskCard.vue';
import NginxCard from './components/NginxCard.vue';
import TrafficCard from './components/TrafficCard.vue';
import PortsCard from './components/PortsCard.vue';
import DockerCard from './components/DockerCard.vue';
import CpuChart from './components/CpuChart.vue';
import MemoryChart from './components/MemoryChart.vue';
import TrafficChart from './components/TrafficChart.vue';

// Use the composable for state management
const {
  serverData,
  loading,
  error,
  updateCount,
  isRealtime,
  updateInterval,
  statusText,
  fetchData,
  setMode,
  setIntervalValue
} = useServerMonitor();

// Use the composable for history
const {
  timestamps,
  cpuHistory,
  memoryHistory,
  trafficHistory,
  addDataPoint,
  hasData
} = useServerHistory();

// Computed for template
const hasHistoryData = computed(() => hasData.value && timestamps.value.length > 1);

// Watch for serverData changes and add to history
import { watch } from 'vue';
watch(serverData, (newData) => {
  if (newData) {
    addDataPoint(newData);
  }
});
</script>
