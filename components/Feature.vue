<script>
export default {
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <div v-editable="blok" class="py-2 text-center">
    <img class="mx-auto w-32" :src="blok.icon" />
    <h1 class="text-lg">{{ blok.name }}</h1>
    <p class="text-gray-600">
      {{ blok.description }}
    </p>
  </div>
</template>