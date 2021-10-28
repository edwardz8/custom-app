<script>
export default {
  props: {
    articleContent: {
      type: Object,
      required: true,
    },
    articleLink: {
      type: String,
      required: true,
    },
    articleMetaTitle: {
      type: String,
    },
    articleMetaDescription: {
      type: String,
    },
  }
};
</script>

<template>
  <div class="mb-2">
    <nuxt-link
      :to="articleLink"
      class="article-teaser block py-4 px-6 border rounded border-gray-500"
    >
      <h2 class="pt-2 pb-4 text-2xl font-bold">
        {{ articleContent.name }}
      </h2>
      <p class="pb-6 leading-relaxed">
        {{ articleContent.intro }}
      </p>
      <p class="pb-6 leading-relaxed">
        {{ articleContent.seo.title }}
      </p>
      <p class="pb-6 leading-relaxed">
        {{ articleContent.seo.description }}
      </p>
    </nuxt-link>
    <div class="buttons">
      <button class="bg-blue-300 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded-r" @click="saveData()">
        Save Draft
      </button>
      <button
         class="bg-blue-300 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        @click="saveData(true)"
      >
        Publish
      </button>
    </div>
  </div>
</template>

<style>
.article-teaser:hover {
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
}
</style>
