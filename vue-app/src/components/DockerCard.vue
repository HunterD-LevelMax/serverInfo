<template>
  <div v-if="containers && containers.length" class="card">
    <h2>🐳 Docker контейнеры</h2>
    
    <div 
      v-for="(container, index) in containers" 
      :key="index" 
      class="docker-container"
    >
      <div class="container-name">{{ container.name }}</div>
      <div class="container-status">
        <span 
          class="badge"
          :class="container.status === 'running' ? 'badge-success' : 'badge-warning'"
        >
          {{ container.status }}
        </span>
        <span v-if="container.status === 'running' && container.uptime" class="container-uptime">
          ({{ container.uptime }})
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  containers: {
    type: Array,
    default: () => []
  }
});
</script>
