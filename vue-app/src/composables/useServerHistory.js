/**
 * Composable for storing server metrics history
 * Keeps last 60 data points (30 minutes with 30-second updates)
 */
import { shallowRef, computed } from 'vue';

const MAX_HISTORY_POINTS = 60;

// Используем shallowRef для массивов
const timestamps = shallowRef([]);
const cpuHistory = shallowRef({
  load_1min: [],
  load_5min: [],
  load_15min: []
});
const memoryHistory = shallowRef({
  used_percent: []
});
const trafficHistory = shallowRef({
  in: [],
  out: []
});

export function useServerHistory() {
  let lastDataHash = '';
  
  /**
   * Add a new data point to history
   * @param {Object} serverData - Server data from API
   */
  const addDataPoint = (serverData) => {
    if (!serverData) return;
    
    // Создаем хеш данных для предотвращения дубликатов
    const dataHash = `${serverData.update_time}_${serverData.load_1min}_${serverData.memory_used_percent}`;
    if (lastDataHash === dataHash) {
      return;
    }
    lastDataHash = dataHash;
    
    const time = serverData.update_time || new Date().toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    // Проверка на дубликат времени
    if (timestamps.value.length > 0 && timestamps.value[timestamps.value.length - 1] === time) {
      return;
    }

    // Создаем новые массивы
    const newTimestamps = [...timestamps.value, time];
    const newCpuLoad1min = [...cpuHistory.value.load_1min, parseFloat(serverData.load_1min) || 0];
    const newCpuLoad5min = [...cpuHistory.value.load_5min, parseFloat(serverData.load_5min) || 0];
    const newCpuLoad15min = [...cpuHistory.value.load_15min, parseFloat(serverData.load_15min) || 0];
    const newMemoryUsed = [...memoryHistory.value.used_percent, serverData.memory_used_percent || 0];
    const newTrafficIn = [...trafficHistory.value.in, serverData.traffic_in || 0];
    const newTrafficOut = [...trafficHistory.value.out, serverData.traffic_out || 0];
    
    // Trim to max points
    if (newTimestamps.length > MAX_HISTORY_POINTS) {
      newTimestamps.shift();
      newCpuLoad1min.shift();
      newCpuLoad5min.shift();
      newCpuLoad15min.shift();
      newMemoryUsed.shift();
      newTrafficIn.shift();
      newTrafficOut.shift();
    }
    
    // Batch update all at once
    timestamps.value = newTimestamps;
    cpuHistory.value = {
      load_1min: newCpuLoad1min,
      load_5min: newCpuLoad5min,
      load_15min: newCpuLoad15min
    };
    memoryHistory.value = { used_percent: newMemoryUsed };
    trafficHistory.value = { in: newTrafficIn, out: newTrafficOut };
  };
  
  const clearHistory = () => {
    timestamps.value = [];
    cpuHistory.value = { load_1min: [], load_5min: [], load_15min: [] };
    memoryHistory.value = { used_percent: [] };
    trafficHistory.value = { in: [], out: [] };
    lastDataHash = '';
  };
  
  const hasData = computed(() => timestamps.value.length > 0);
  const dataPointsCount = computed(() => timestamps.value.length);
  
  return {
    timestamps,
    cpuHistory,
    memoryHistory,
    trafficHistory,
    hasData,
    dataPointsCount,
    addDataPoint,
    clearHistory
  };
}