<script setup>
import { defineProps, defineEmits } from 'vue'
const { modelValue } = defineProps(['modelValue'])
const emit = defineEmits()

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
}
</script>

<style scoped>
#search-bar {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  
}

</style>

<template>
  <div id="search-bar" class="text-center">
    <v-text-field id="search-bar2"
      :model-value="modelValue"
      @input="handleInput"
      placeholder="Rechercher"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      density="compact"
      clearable
      clear-icon="mdi-close"
      @click:clear="emit('update:modelValue', '')"
    ></v-text-field>
  </div>
</template>
