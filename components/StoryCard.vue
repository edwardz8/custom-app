<script>
export default {
  props: {
    story: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<template>
  <div
    class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white"
    style="min-width: 300px"
  >
    <div class="flex justify-between">
      <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
        {{ story.title }}
      </p>
    </div>
    <div class="flex mt-4 justify-between items-center">
      <span class="text-sm text-gray-600">[{{ story.id }}]</span>
    </div>
  </div>
</template>
