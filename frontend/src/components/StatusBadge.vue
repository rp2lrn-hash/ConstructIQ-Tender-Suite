<script setup>
const props = defineProps({
  status: {
    type: String,
    default: 'neutral'
  }
})

const badgeStyles = {
  danger: 'bg-status-red-light text-status-red',
  warning: 'bg-status-yellow-light text-status-yellow',
  neutral: 'bg-neutral-100 text-text-secondary',
  success: 'bg-status-green-light text-status-green',
  info: 'bg-accent-blue-light text-accent-blue'
}
</script>

<template>
  <span 
    :class="[
      'px-3 py-1 text-xs font-medium',
      badgeStyles[status] || badgeStyles.neutral
    ]"
    style="border-radius: 999px;"
  >
    <slot />
  </span>
</template>
