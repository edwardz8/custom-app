<script>

export default {
  props: {
    blok: {
      type: Object,
      required: true,
    }
  },

  computed: {
    sortedArticles() {
      const featuredArticles = this.$store.state.articles.filter((article) => {
        return this.blok.articles.includes(article.uuid);
      });
      featuredArticles.sort((a, b) => {
        return this.blok.articles.indexOf(a.uuid) - this.blok.articles.indexOf(b.uuid);
      });
      return featuredArticles;
    },
  },
};
</script>

<template>
  <div v-editable="blok">
    <h2 class="pt-2 pl-6 text-lg text-gray-700 italic">{{ blok.title }}</h2>
    <p class="pt-2 pl-6">
      {{ blok.meta_description.title }} :
      <span>{{ blok.meta_description.description }}</span>
    </p>
    <ul class="flex flex-col py-6 mb-6">
      <li
        v-for="article in sortedArticles"
        :key="article._uid"
        class="flex-auto px-6"
        style="min-width: 33%"
      >
        <article-teaser
          v-if="article.content"
          :article-meta-title="article.content.seo.title"
          :article-meta-description="article.content.seo.description"
          :article-link="article.full_slug"
          :article-content="article.content"
        />
      </li>
    </ul>
  </div>
</template>
