/**
 * Composable for server monitoring state management
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { serverApi } from '../services/api.js';

export function useServerMonitor() {
  // State
  const serverData = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const updateCount = ref(0);
  const isRealtime = ref(true);
  const updateInterval = ref(5);
  
  let timer = null;

  // Computed
  const statusText = computed(() => {
    return isRealtime.value 
      ? `🟢 Автообновление (${updateInterval.value} сек)`
      : '⏸️ Статичный режим';
  });

  // Methods
  const fetchData = async () => {
    if (!isRealtime.value && timer) return;
    
    updateCount.value++;
    
    // Only show loading on initial load, not on updates
    const isInitialLoad = !serverData.value;
    
    try {
      if (isInitialLoad) {
        loading.value = true;
      }
      error.value = null;
      serverData.value = await serverApi.fetchData();
    } catch (err) {
      error.value = err.message || 'Ошибка загрузки данных';
      console.error('Fetch error:', err);
    } finally {
      if (isInitialLoad) {
        loading.value = false;
      }
    }
  };

  const startAutoUpdate = () => {
    if (timer) clearInterval(timer);
    if (isRealtime.value) {
      timer = setInterval(fetchData, updateInterval.value * 1000);
    }
  };

  const stopAutoUpdate = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const setMode = (realtime) => {
    isRealtime.value = realtime;
    saveSettings();
    
    if (realtime) {
      startAutoUpdate();
    } else {
      stopAutoUpdate();
    }
  };

  const setIntervalValue = (value) => {
    if (value >= 1 && value <= 30) {
      updateInterval.value = value;
      saveSettings();
      
      if (isRealtime.value) {
        startAutoUpdate();
      }
      return true;
    }
    return false;
  };

  const saveSettings = () => {
    localStorage.setItem('monitor_interval', updateInterval.value.toString());
    localStorage.setItem('monitor_realtime', isRealtime.value.toString());
  };

  const loadSettings = () => {
    const savedInterval = localStorage.getItem('monitor_interval');
    const savedRealtime = localStorage.getItem('monitor_realtime');
    
    if (savedInterval) {
      updateInterval.value = parseInt(savedInterval, 10);
    }
    
    if (savedRealtime !== null) {
      isRealtime.value = savedRealtime === 'true';
    }
  };

  // Lifecycle
  onMounted(() => {
    loadSettings();
    fetchData();
    startAutoUpdate();
  });

  onUnmounted(() => {
    stopAutoUpdate();
  });

  return {
    // State
    serverData,
    loading,
    error,
    updateCount,
    isRealtime,
    updateInterval,
    
    // Computed
    statusText,
    
    // Methods
    fetchData,
    setMode,
    setIntervalValue,
    startAutoUpdate,
    stopAutoUpdate
  };
}
