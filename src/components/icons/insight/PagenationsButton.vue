<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="white" />
    <path
      d="M22.916 14.667L17.4993 20.0837L22.916 25.5003"
      :stroke="disabled ? '#DDE1E4' : '#484B51'"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>
