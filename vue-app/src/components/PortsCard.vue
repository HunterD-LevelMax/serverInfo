<template>
  <div v-if="ports && ports.length" class="card">
    <h2>🔌 Открытые порты</h2>
    <div class="port-list">
      <span 
        v-for="(port, index) in ports" 
        :key="index" 
        class="port-item"
      >
        {{ port }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ports: {
    type: Array,
    default: () => []
  }
});
</script>
