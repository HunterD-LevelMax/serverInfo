<template>
  <div class="card chart-card">
    <h2>📈 История сетевого трафика</h2>
    <div class="chart-container">
      <Line 
        :data="chartData" 
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  timestamps: {
    type: Array,
    default: () => []
  },
  trafficHistory: {
    type: Object,
    default: () => ({
      in: [],
      out: []
    })
  }
});

const chartData = computed(() => ({
  labels: props.timestamps,
  datasets: [
    {
      label: 'Входящий (KB/s)',
      data: props.trafficHistory.in,
      borderColor: '#00d9a5',
      backgroundColor: 'rgba(0, 217, 165, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 3,
      pointBackgroundColor: '#00d9a5',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    },
    {
      label: 'Исходящий (KB/s)',
      data: props.trafficHistory.out,
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 3,
      pointBackgroundColor: '#667eea',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: '600'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(26, 26, 53, 0.95)',
      padding: 12,
      titleFont: { size: 13, weight: '600' },
      bodyFont: { size: 12 },
      borderColor: 'rgba(0, 217, 165, 0.3)',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} KB/s`;
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 10,
        font: { size: 11, weight: '500' },
        color: '#8888aa'
      }
    },
    y: {
      display: true,
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 217, 165, 0.1)'
      },
      ticks: {
        font: { size: 11, weight: '500' },
        color: '#8888aa',
        callback: function(value) {
          return value + ' KB/s';
        }
      }
    }
  }
};
</script>

<style scoped>
.chart-card {
  min-height: 280px;
}

.chart-container {
  position: relative;
  height: 200px;
  width: 100%;
}
</style>
