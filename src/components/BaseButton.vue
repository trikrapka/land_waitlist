<template>
  <button :class="['base-button', variant]">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "glass";
}>();
</script>

<style scoped>
.base-button {
  padding: 0.8rem 1.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 14px 0
    hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.39);
}

.primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.23);
}

.secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.secondary:hover {
  border-color: var(--primary);
  background: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.05);
}

.glass {
  background: var(--glass);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid var(--glass-border);
  color: var(--text);
}

.glass:hover {
  background: hsla(0, 0%, 100%, 0.08);
  border-color: hsla(0, 0%, 100%, 0.2);
  transform: translateY(-1px);
}

.base-button:active {
  transform: translateY(0);
}
</style>
