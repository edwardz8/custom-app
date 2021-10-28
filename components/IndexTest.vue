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
    <div class="flex justify-center">
      <!-- <div
        v-for="column in columns"
        :key="column.title"
        class="w-full bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4"
      >
        <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
          {{ column.title }}
        </p> -->
      <!-- <story-card
        v-for="(story) in column.articles"
        :key="story.id"
        :story="story"
        class="mt-3"
      /> -->
      <featured-articles
        v-if="story.content.component"
        :key="story.content_uid"
        :blok="story.content"
        :is="story.content.component"
      />
    </div>
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
      story: {},
      stories: [],
      page: 1,
      per_page: 5,
      total: 0,
      /* columns: [
        {
          title: "Unpublished",
          articles: [],
        },
        {
          title: "Published",
          articles: [],
        },
      ], */
    };
  },
  /* computed: {
    selectedStories() {
      return this.$store.state.stories;
    },
    availablePages() {
      return Math.ceil(this.total / this.per_page);
    },
  }, */
  mounted() {
    if (window.top == window.self) {
      // https://app.storyblok.com/oauth/authorize?client_id=eEzS%2FO9kvztN0GVE2pqtJQ%3D%3D&response_type=code&redirect_uri=https%3A%2F%2F558f-69-1-48-73.ngrok.io%2Fauth%2Fcallback&scope=read_content%20write_content&state=23be4f7f-4aab-471f-bee3-b9babc8fcd66&code_chalenge=ef69169efa011941301bdbb23b65f1c7a8b12756307e26da4b08fbec0bf628b1&code_chalenge_method=S256
      window.location.assign("https://app.storyblok.com/oauth/app_redirect");
    } else {
      this.loadStories();
      //
    }
  },
  async fetch(context) {
    // loading reference data - articles in this case
    if (context.store.state.articles.loaded !== "1") {
      let articlesRefRes = await context.app.$storyapi.get(`cdn/stories/`, {
        // GET /v1/spaces/:space_id/stories/:story_id
        // /auth/spaces/${this.$route.query.space_id}/stories/:story_id 
        starts_with: "articles/",
        version: "draft",
      });
      console.log(articlesRefRes, 'cdn stories')
      context.store.commit("setArticles", articlesRefRes.data.stories);
      context.store.commit("setLoaded", "1");
    }
  },
  asyncData(context) {
    // inside real project
    // const version = context.query._storyblok || context.isDev ? 'draft' : 'published'
    // const fullSlug = (context.route.path == '/' || context.route.path == '') ? 'home'
    return context.app.$storyapi
      .get("cdn/stories/home", {
        version: "draft",
      })
      .then((res) => {
        return res.data;
      })
      .catch((res) => {
        if (!res.response) {
          console.error(res);
          context.error({
            statusCode: 404,
            message: "Failed to receive content from api",
          });
        } else {
          console.error(res.response.data);
          context.error({ statusCode: res.response.status, message: res.response.data });
        }
      });
  },
  methods: {
    loadStories() {
      // get the space id from URL and use it in requests
      /* return await axios
        .get(`/auth/spaces/${this.spaceId}/stories`)
        .then((res) => {
          this.per_page = res.data.per_page
          this.total = res.data.total
          this.stories = res.data.stories
        }) */
      axios
        .get(`/auth/spaces/${this.$route.query.space_id}/stories`)
        .then((res) => {
          this.stories = res.data.stories;

          for (const story of res.data.stories) {
            const compStory = {
              title: story.name,
              published: story.published,
              unpublished_changes: story.unpublished_changes,
              id: story.id,
            };
            if (compStory.published) {
              this.columns[0].stories.push(compStory);
            } else if (compStory.unpublished_changes) {
              this.columns[1].stories.push(compStory);
            } else {
              this.columns[2].stories.push(compStory);
            }
          }
        });
    },
  },
};
</script>

<style scoped></style>
