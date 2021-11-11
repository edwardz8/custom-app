<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center py-4">
      <b-pagination
        v-model="page"
        :total-rows="this.total"
        :per-page="page"
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
    FeaturedArticles,
  },
  data() {
    return {
      stories: [],
      perPage: 3, // stories per page
      page: 1, // current page
      total: null, // all stories
      storiesWithData: [],
      space_id: [],
    };
  },

  async mounted() {
    if (window.top == window.self) {
      // Redirect if outside Storyblok
      window.location.assign("https://app.storyblok.com/oauth/app_redirect");
    } else {
      // Init the stories 
      await this.handlePageChange();
      // console.log(this.stories);
    }
  },

  methods: {
    handlePageChange(value) {
      this.page = value
      this.getStories()
    },

    async getStories() {
      let stories = []

      let all_pages = await axios.get(
        `/auth/spaces/${this.$route.query.space_id}/stories?per_page=${this.perPage}&page=${this.page}`
      );

      stories = all_pages.data.stories

      this.total = Math.ceil(all_pages.data.total / this.perPage);

      await Promise.all(
        stories.map((story) => {
          return axios
            .get(`/auth/spaces/${this.$route.query.space_id}/stories/${story.id}`)
            .then((res) => {
              if (res.data.story) {
                if (!res.data.story.content.seo) {
                  res.data.story.content.seo = {
                    title: "",
                    description: "",
                    plugin: "meta-fields",
                  };
                }
                this.storiesWithData.push(JSON.parse(JSON.stringify(res.data.story))
                );
                // this.initialStories.push(JSON.parse(JSON.stringify(response.data.story)));
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
    filteredStories: function () {
      return this.storiesWithData;
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
