<script setup>
import { ref } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <div>MeshView</div>
</template>

<style lang="postcss" scoped>
a {
  color: #42b983;
}
</style>
