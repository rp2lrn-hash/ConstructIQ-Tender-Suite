<script setup>
const props = defineProps({
  status: {
    type: String,
    default: 'neutral'
  }
})

const badgeStyles = {
  danger: 'text-status-error',
  warning: 'text-status-warning',
  neutral: 'text-text-secondary',
  success: 'text-status-success',
  info: 'text-teal-primary'
}

const badgeBgStyles = {
  danger: 'bg-status-error-bg',
  warning: 'bg-status-warning-bg',
  neutral: 'bg-neutral-100',
  success: 'bg-status-success-bg',
  info: 'bg-teal-soft'
}
</script>

<template>
  <span 
    :class="[
      'badge-lms',
      badgeStyles[status] || badgeStyles.neutral,
      badgeBgStyles[status] || badgeBgStyles.neutral
    ]"
  >
    <slot />
  </span>
</template>
