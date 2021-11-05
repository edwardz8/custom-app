<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center py-4">
      <b-pagination
        v-model="page"
        :total-rows="rows"
        :per-page="pageSize"
        @change="handlePageChange"
        pills
      ></b-pagination>
    </div>
    <div class="container">
      <div class="stories flex flex-col justify-center">
        <story-card
          v-for="story in filteredStories"
          v-bind:key="story.id"
          v-bind:data="story"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StoryCard from "~/components/StoryCard.vue";
import FeaturedArticles from "~/components/FeaturedArticles.vue";

export default {
  components: {
    StoryCard,
    FeaturedArticles
  },
  data() {
    return {
      components: [],
      stories: [],
      perPage: 2,
      page: 1, // current page
      // count: 0, // total number of pages
      pageSize: 3, // number of items on each page
      total: null, // total number of pages
      initialStories: [],
      storiesWithData: [],
      space_id: [],
      current_space: null,
      token: null,
      keyword: '',
      status: "",
    };
  },

  async mounted() {
    if (window.top == window.self) {
      // Redirect if it's outside Storyblok
      window.location.assign("https://app.storyblok.com/oauth/app_redirect");
    } else {
      // Init the stories and components list
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

    handlePageChange(value, pageNum) {
      this.page = value
      this.getStories(pageNum)
    },

    async getStories() {
      let stories = [];

      let first_page = await axios.get(
        `/auth/spaces/${this.$route.query.space_id}/stories?per_page=${this.perPage}&page=${this.page}`
      )

      // let total_pages = Math.ceil(first_page.data.total / this.per_page);

      stories = stories.concat(first_page.data.stories);

      // Getting the components
      this.stories = stories.slice(0);

      // Getting the data of each story
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
    }
  },

  computed: {
    filteredStories: function() {
      return this.storiesWithData
    },
    rows: function() {
      return this.storiesWithData.length
    }
  }
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
