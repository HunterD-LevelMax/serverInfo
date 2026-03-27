/**
 * Composable for storing server metrics history
 * Keeps last 60 data points (30 minutes with 30-second updates)
 */
import { ref, computed } from 'vue';

const MAX_HISTORY_POINTS = 60;

// Shared state
const timestamps = ref([]);
const cpuHistory = ref({
  load_1min: [],
  load_5min: [],
  load_15min: []
});
const memoryHistory = ref({
  used_percent: []
});
const trafficHistory = ref({
  in: [],
  out: []
});

export function useServerHistory() {
  /**
   * Add a new data point to history
   * @param {Object} serverData - Server data from API
   */
  const addDataPoint = (serverData) => {
    if (!serverData) return;
    
    const time = serverData.update_time || new Date().toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Add timestamp
    timestamps.value.push(time);
    
    // Add CPU data
    cpuHistory.value.load_1min.push(parseFloat(serverData.load_1min) || 0);
    cpuHistory.value.load_5min.push(parseFloat(serverData.load_5min) || 0);
    cpuHistory.value.load_15min.push(parseFloat(serverData.load_15min) || 0);
    
    // Add memory data
    memoryHistory.value.used_percent.push(serverData.memory_used_percent || 0);
    
    // Add traffic data
    trafficHistory.value.in.push(serverData.traffic_in || 0);
    trafficHistory.value.out.push(serverData.traffic_out || 0);
    
    // Trim to max points
    if (timestamps.value.length > MAX_HISTORY_POINTS) {
      timestamps.value.shift();
      cpuHistory.value.load_1min.shift();
      cpuHistory.value.load_5min.shift();
      cpuHistory.value.load_15min.shift();
      memoryHistory.value.used_percent.shift();
      trafficHistory.value.in.shift();
      trafficHistory.value.out.shift();
    }
  };
  
  /**
   * Clear all history data
   */
  const clearHistory = () => {
    timestamps.value = [];
    cpuHistory.value = { load_1min: [], load_5min: [], load_15min: [] };
    memoryHistory.value = { used_percent: [] };
    trafficHistory.value = { in: [], out: [] };
  };
  
  // Computed for easy access
  const hasData = computed(() => timestamps.value.length > 0);
  const dataPointsCount = computed(() => timestamps.value.length);
  
  return {
    // State
    timestamps,
    cpuHistory,
    memoryHistory,
    trafficHistory,
    
    // Computed
    hasData,
    dataPointsCount,
    
    // Methods
    addDataPoint,
    clearHistory
  };
}
