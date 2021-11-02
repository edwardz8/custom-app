<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center py-4">
      <!-- PAGINATION -->
      <!-- <SbPagination v-model="page" :per-page="per_page" :total="total" :carousel="true" /> -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between">
          <a
            href="#"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </a>
          <a
            href="#"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </a>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="stories flex flex-col justify-center">
        <story-card v-for="story in filteredStories" v-bind:key="story.id" v-bind:data="story" />
      </div>
    </div>
    <!-- <div class="flex justify-center">
      <featured-articles
        v-if="story"
        :key="story.id"
        :blok="story.content"
        :is="story.content"
      />
    </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
import axios from "axios";
import StoryCard from "~/components/StoryCard.vue";
import FeaturedArticles from "~/components/FeaturedArticles.vue";

export default {
  components: {
    StoryCard,
    FeaturedArticles,
  },
  data() {
    return {
      components: [],
      stories: [],
      initialStories: [],
      storiesWithData: [],
      space_id: [],
      component: "none",
      current_space: null,
      token: null,
      keyword: '',
      per_page: 2,
      /* perPage: null, */
      total: null,
      status: "",
    };
  },

  async mounted() {
    if (window.top == window.self) {
      // Redirect if it's outside Storyblok
      window.location.assign("https://app.storyblok.com/oauth/app_redirect");
    } else {
      // Init the stories and components list
      //await this.getStories();
      await this.getStories();
      console.log(this.initialStories)
    }
  },

  methods: {
    async getSpace() {
      console.log(this.$route);
      const spaceData = await axios.get(
        `/auth/spaces/${this.$route.query.space_id}/space`
      );
      console.log(spaceData.data);
    },

    /**
     * Get the list of Stories
     */
    async getStories() {
      let stories = [];

      // Get the first page
      let first_page = await axios.get(
        `/auth/spaces/${this.$route.query.space_id}/stories?=1&per_page=${this.per_page}&sort_by=name:asc`
      );
      let pages_requests = [];
      stories = stories.concat(first_page.data.stories);

      // Eventually Getting Other Pages
      if (first_page.data.total > 1) {
        let total_pages = Math.ceil(first_page.data.total / this.per_page);

        for (var i = 2; i <= total_pages; i++) {
          pages_requests.push(
            axios.get(
              `/auth/spaces/${this.$route.query.space_id}/=1&per_page=${this.per_page}&page=${i}&sort_by=name:asc`
            )
            .then((res) => {
              // this.per_page = res.data.per_page
              // this.total = res.data.total
              // this.stories = res.data.stories
            })
          );
        }

        let pages_requests_data = await Promise.all(pages_requests);
        pages_requests_data.forEach((req) => {
          stories = stories.concat(req.data.stories);
        });
      }

      // Getting the components
      this.stories = stories.slice(0);

      // Getting the data of each story
      let storiesWithData = [];
      await Promise.all(
        stories.map((story) => {
          return axios
            .get(
              `/auth/spaces/${this.$route.query.space_id}/stories/${story.id}`
            )
            .then((response) => {
              if (response.data.story) {
                if (!response.data.story.content.seo) {
                  response.data.story.content.seo = {
                    title: "",
                    description: "",
                    plugin: "meta-fields",
                  };
                }
                this.storiesWithData.push(
                  JSON.parse(JSON.stringify(response.data.story))
                );
                this.initialStories.push(
                  JSON.parse(JSON.stringify(response.data.story))
                );
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
      );
      
    },
  },

  computed: {
    filteredStories: function() {
      return this.storiesWithData.filter(s => !this.keyword || s.name.toLowerCase().includes(this.keyword.toLowerCase()));
    },
    /* sortedArticles() {
      const featuredArticles = this.$store.state.articles.filter((article) => {
        return this.blok.articles.includes(article.uuid);
      });
      featuredArticles.sort((a, b) => {
        return this.blok.articles.indexOf(a.uuid) - this.blok.articles.indexOf(b.uuid);
      });
      return featuredArticles;
    }, */
  },
};
</script>

<style scoped>
  .container {
    padding: 0 25px;
  }

  .stories {
    padding: 20px 0;
    width: 100%;
  }

  .search {
    background-color: #fff;
    padding: 6px 0;
  }
</style>
