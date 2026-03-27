<template>
  <div class="card chart-card">
    <h2>📈 История использования памяти</h2>
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
  memoryHistory: {
    type: Object,
    default: () => ({
      used_percent: []
    })
  }
});

const chartData = computed(() => ({
  labels: props.timestamps,
  datasets: [
    {
      label: 'Использовано %',
      data: props.memoryHistory.used_percent,
      borderColor: '#f093fb',
      backgroundColor: 'rgba(240, 147, 251, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 3,
      pointBackgroundColor: '#f093fb',
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
      borderColor: 'rgba(240, 147, 251, 0.3)',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
        }
      }
    },
    annotation: {
      annotations: {
        line50: {
          type: 'line',
          yMin: 50,
          yMax: 50,
          borderColor: 'rgba(255, 193, 7, 0.6)',
          borderWidth: 2,
          borderDash: [5, 5]
        },
        line80: {
          type: 'line',
          yMin: 80,
          yMax: 80,
          borderColor: 'rgba(255, 107, 107, 0.6)',
          borderWidth: 2,
          borderDash: [5, 5]
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
      max: 100,
      grid: {
        color: 'rgba(240, 147, 251, 0.1)'
      },
      ticks: {
        font: { size: 11, weight: '500' },
        color: '#8888aa',
        callback: function(value) {
          return value + '%';
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
