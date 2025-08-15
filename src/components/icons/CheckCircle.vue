<script setup>
defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="11.25"
      :fill="checked ? '#373D5C' : 'none'"
      :stroke="checked ? 'none' : '#8C949E'"
      stroke-width="1.5"
    />
    <path
      d="M6.2998 12.1846L10.2427 16.1275L17.7998 8.57031"
      :stroke="checked ? 'white' : '#8C949E'"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
  </svg>
</template>
