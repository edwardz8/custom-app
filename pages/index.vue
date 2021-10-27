<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center py-4">
      <!-- <SbLoading type="spinner" size="x-large" color="primary" /> -->
      <SbPagination v-model="page" :per-page="perPage" :total="total" :carousel="true" />
    </div>
    <div class="flex justify-center">
      <div
        v-for="column in columns"
        :key="column.title"
        class="w-full bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4"
      >
        <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
          {{ column.title }}
        </p>
        <!-- <story-card
        v-for="story in column.stories"
        :key="story.id"
        :story="story"
        class="mt-3"
      /> -->
        <!-- articles -->
          <component
            v-if="story.content.component"
            :key="story.content._uid"
            :blok="story.content"
            :is="story.content.component"
          />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      page: 1,
      perPage: 5,
      total: 0,
      story: {
        content: {},
      },
      stories: [],
      columns: [
        {
          title: "Unpublished",
          stories: [],
        },
        {
          title: "Published",
          stories: [],
        },
      ],
    };
  },
  computed: {
    selectedStories() {
      return this.$store.state.stories;
    },
    availablePages() {
      return Math.ceil(this.total / this.perPage);
    },
  },
  mounted() {
    if (window.top == window.self) {
      // https://app.storyblok.com/oauth/authorize?client_id=eEzS%2FO9kvztN0GVE2pqtJQ%3D%3D&response_type=code&redirect_uri=https%3A%2F%2F558f-69-1-48-73.ngrok.io%2Fauth%2Fcallback&scope=read_content%20write_content&state=23be4f7f-4aab-471f-bee3-b9babc8fcd66&code_chalenge=ef69169efa011941301bdbb23b65f1c7a8b12756307e26da4b08fbec0bf628b1&code_chalenge_method=S256
      window.location.assign("https://app.storyblok.com/oauth/app_redirect");
    } else {
      this.loadStories();
    }
  },
  async fetch(context) {
    // loading reference data - articles in this case
    if (context.store.state.articles.loaded !== "1") {
      let articlesRefRes = await context.app.$storyapi.get(`cdn/stories/`, {
        starts_with: "articles/",
        version: "draft",
      });
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
    async loadStories() {
      // pagination - https://api.storyblok.com/v1/spaces/(:space_id)/stories/?per_page=2&page=1
      // get unpublished changes boolean property
      let stories = [];

      // Get the first page
      let first_page = await axios.get(
        `/auth/spaces/${this.$route.query.space_id}/stories?contain_component=Courses%20Module&with_summary=1&per_page=${this.per_page}&sort_by=name:asc`
      );
      let pages_requests = [];
      stories = stories.concat(first_page.data.stories);

      // Eventually Getting Other Pages
      if (first_page.data.total > 1) {
        let total_pages = Math.ceil(first_page.data.total / this.per_page);

        for (var i = 2; i <= total_pages; i++) {
          pages_requests.push(
            axios.get(
              `/auth/spaces/${this.$route.query.space_id}/stories?with_summar=1&per_page=${this.per_page}&page=${i}&sort_by=name:asc`
            )
          );
        }

        let pages_requests_data = await Promise.all(pages_requests);
        pages_requests_data.forEach((req) => {
          stories = stories.concat(req.data.stories);
        });
      }

      /* axios
        .get(`/auth/explore/spaces/${this.$route.query.space_id}/stories`)
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
        }); */
    },
    /* loadStory() {
      axios
        .get(`/auth/explore/spaces/${this.$route.query.space.id}/stories/79698930`)
        .then((res) => {
          this.story = res.data.story;
        });
    }, */
  },
};
</script>

<style scoped></style>
