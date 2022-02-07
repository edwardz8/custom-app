<script>
import axios from "axios";
import StoryCard from "~/components/StoryCard.vue";
import {getStories} from './../lib/utils'

export default {
  data() {
    return {
      storiesWithData: [],
      pageSize: 3, // stories per page
      current: 1, // current page
      total: null, // all stories
    };
  },

  async mounted() {
    if (window.top == window.self) {
      // Redirect if outside Storyblok
      window.location.assign("https://app.storyblok.com/oauth/app_redirect");
    } else {
      // Init the stories
      await this.setPage(1);
    }
  },

  computed: {
    totalPages: function () {
      return Math.ceil(this.total / this.pageSize);
    },
  },

  methods: {
    setPage: async function (pageNumber) {
      this.current = pageNumber
      const {stories, total} = await getStories(this.$route.query.space_id, this.pageSize, this.current)
      this.total = total
      this.storiesWithData = stories
    }
  },
};
</script>

<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center py-4">
      <nav class="inline-flex rounded shadow-sm" aria-label="pagination">
        <a
          v-for="pageNumber in totalPages"
          :key="pageNumber"
          @click="setPage(pageNumber)"
          class="relative inline-flex items-center px-2 py-2 rounded border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span>{{ pageNumber }}</span>
        </a>
      </nav>
    </div>
    <div class="container">
      <div class="w-100 px-20 flex flex-col justify-center">
        <div>
          <story-card
            v-for="story in storiesWithData"
            v-bind:key="story.id"
            v-bind:data="story"
          />
        </div>
      </div>
    </div>
  </div>
</template>
