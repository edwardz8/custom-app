<script>
export default {
  props: {
    blok: {
      type: Object
    },
  },
};
</script>

<template>
  <div v-editable="blok" class="py-8 mb-6 text-2xl font-bold text-center">
    <img class="h-48 mb-4 object-cover" :src="blok.image.filename" />
    <h3 class="text-5xl">{{ blok.headline }}</h3>
  </div>
</template>