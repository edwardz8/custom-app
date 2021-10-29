<script>
import axios from "axios";
export default {
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      open: false,
      currentTab: "overview",
      story: {},
    };
  },

  mounted() {
    if (this.data)
      if (!this.data.content.body) {
        this.data.content.body = [];
      }
    if (this.data.content.body.length === 0) {
      this.data.content.body.push({ component: "[Template] Story Detail", intro: [] });
    }
    if (
      !this.data.content.body[0].intro ||
      this.data.content.body[0].intro.length === 0
    ) {
      this.data.content.body[0].intro = [{ component: "[Block] Stories Detail - Intro" }];
    }
    this.story = this.data;
  },

  /* computed: {
    sortedArticles() {
      const featuredArticles = this.$store.state.articles.filter((article) => {
        return this.blok.articles.includes(article.uuid);
      });
      featuredArticles.sort((a, b) => {
        return this.blok.articles.indexOf(a.uuid) - this.blok.articles.indexOf(b.uuid);
      });
      return featuredArticles;
    },
  }, */

  methods: {
    showTab(name) {
      this.currentTab = name;
    },

    async saveData(publish) {
      if (publish) {
        this.open = false;
      }

      let storyData = {
        story: {
          content: this.story.content,
        },
      };

      if (storyData.story.content.articles) {
        for (const story of storyData.story.content.articles) {
          delete story._uid;
        }
        console.log(this.story, storyData);
      }

      if (publish) {
        storyData.publish = 1;
        this.story.unpublished_changes = false;
      } else {
        this.story.unpublished_changes = true;
      }

      return axios.put(
        `/auth/spaces/${this.$route.query.space_id}/stories/${this.story.id}`,
        storyData
      );
    },

    openStory: function (event) {
      event.target.closest(".story").classList.toggle("visible");
    },
  },

  props: ["data"],
};
</script>

<template>
  <div>
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
    <div
      :key="story.id"
      v-if="story.content"
    >
      <h3>{{ story.content.body.content }}</h3>
      <div class="course__tools">
        <button
          class="button course__button course__button--open"
          v-on:click="open = true"
        >
          <span>Expand</span>
        </button>
        <button
          class="button course__button course__button--close"
          v-on:click="open = false"
        >
          <span>Close</span>
        </button>
      </div>
    </div>
  </div>
</template>
