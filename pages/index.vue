<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center py-4">
      <b-pagination
        v-model="current"
        :total-rows="total"
        :per-page="pageSize"
        @change="handlePageChange"
        pills 
      ></b-pagination>
    </div>
    <div class="container">
      <div class="stories flex flex-col justify-center">
        <story-card
          v-for="story in storiesWithData"
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
      // stories: [],
      pageSize: 3, // stories per page
      current: 1, // current page
      total: null, // all stories
      storiesWithData: [],
      /* initialStories: [],
      space_id: [], */
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

  computed: {
    indexStart() {
      return(this.current - 1) * this.pageSize
    },
    indexEnd() {
      return this.indexStart + this.pageSize 
    },
    filteredStories: function () {
      return this.storiesWithData
    }
  },

  methods: {
    handlePageChange(value) {
      this.current = value
      this.getStories()
    },

    async getStories() {

      let all_pages = await axios.get(
        `/auth/spaces/${this.$route.query.space_id}/stories?per_page=${this.pageSize}&page=${this.current}`
      );
      
      this.storiesWithData = []

      this.total = all_pages.data.total

      await Promise.all(
        all_pages.data.stories.map((story) => {
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
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
      );
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
