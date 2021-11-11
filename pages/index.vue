<template>
  <div class="container mx-auto">
    <div class="w-full flex justify-center py-4">
      <b-pagination
        v-model="current"
        :total-rows="this.paginatedStories.length"
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
    FeaturedArticles,
  },
  data() {
    return {
      stories: [],
      pageSize: 3, // stories per page
      current: 1, // current page
      total: 2, // all stories
      storiesWithData: [],
      initialStories: [],
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

  computed: {
    indexStart() {
      return(this.current - 1) * this.pageSize
    },
    indexEnd() {
      return this.indexStart + this.pageSize 
    },
    paginatedStories: function () {
      return this.storiesWithData.slice(this.indexStart, this.indexEnd)
    },
    filteredStories: function () {
      return this.storiesWithData
    }
  },

  methods: {
    // should parameter be value = 1 ?
    handlePageChange(value) {
      this.current = value
      this.getStories()
    },

    /* prev() {
      this.current--
    },

    next() {
      this.current++
    }, */

    async getStories() {
      let stories = []

      // let initialStories = []

      let all_pages = await axios.get(
        `/auth/spaces/${this.$route.query.space_id}/stories?per_page=${this.perPage}&page=${this.page}`
      );

      stories = all_pages.data.stories

      this.total = Math.ceil(all_pages.data.total / this.pageSize);

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

                // ^ when res.data.story isn't parsed and stringified the story data and stories don't display
                // should i take the initialStories array from above and push 
                // the storiesWithData into the initialStories like so: 
                // this.storiesWithData.push(...this.initialStories(JSON.parse(JSON.stringify(res.data.story)))
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
