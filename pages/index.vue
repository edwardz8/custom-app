<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center py-4">
      <!-- PAGINATION -->
      <!-- <SbPagination v-model="page" :per-page="per_page" :total="total" :carousel="true" /> -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
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
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <a
                href="#"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Previous</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Next</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="stories flex justify-center">
        <story-card v-for="story in filteredStories" v-bind:key="story.uuid" v-bind:data="story" />
        <!-- <Course v-for="story in filteredStories" v-bind:key="story.id" v-bind:data="story" /> -->
      </div>
    </div>
    <!-- <div class="flex justify-center">
      <featured-articles
        v-if="story.content.component"
        :key="story.content_uid"
        :blok="story.content"
        :is="story.content.body.component"
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
      per_page: 90,
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
                if (!response.data.story.content.seo_metatags) {
                  response.data.story.content.seo_metatags = {
                    title: "",
                    description: "",
                    plugin: "seo_metatags",
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
