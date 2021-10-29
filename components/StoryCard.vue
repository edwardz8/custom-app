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


  computed: {
    filteredStories: function() {
      return this.storiesWithData.filter(s => !this.keyword || s.name.toLowerCase().includes(this.keyword.toLowerCase()));
    },
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

  mounted() {
    if (this.data)
      if (!this.data.content.body) {
        this.data.content.body = [];
      }
    this.story = this.data;
  },

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
          content: this.story,
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
  },

  props: ["data"],
};
</script>

<template>
  <div class="container mx-auto">
    <div
      :key="story.id"
      v-if="story"
      class="py-4 px-8 bg-white shadow-lg rounded-lg my-2 mx-2"
    >
      <div>
        <h4 class="text-gray-800 text-3xl font-semibold">{{ story.name }}</h4>
        <!-- <p class="mt-2 text-gray-600">{{ story.content.intro }}</p>
        <p class="mt-2 text-gray-600">{{ story.content.seo.description }}</p>
        <p class="mt-2 text-gray-600">{{ story.content.seo.title }}</p> -->

      </div>
      <div class="flex justify-end mt-4">
        <button
          class="mx-2 bg-blue-300 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          @click="saveData()"
        >
          Save Draft
        </button>
        <button
          class="mx-2 bg-blue-300 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          @click="saveData(true)"
        >
          Publish
        </button>
      </div>
      </div>
  </div>
</template>
