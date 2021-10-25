<template>
  <div class="flex justify-center">
    <div
      v-for="column in columns"
      :key="column.title"
      class="bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4"
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
</template>

<script>
import StoryCard from "~/components/StoryCard.vue";
import axios from "axios";

export default {
  components: {
    StoryCard,
  },
  data() {
    return {
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
  mounted() {
    if (window.top == window.self) {
      // https://app.storyblok.com/oauth/authorize?client_id=eEzS%2FO9kvztN0GVE2pqtJQ%3D%3D&response_type=code&redirect_uri=https%3A%2F%2F558f-69-1-48-73.ngrok.io%2Fauth%2Fcallback&scope=read_content%20write_content&state=23be4f7f-4aab-471f-bee3-b9babc8fcd66&code_chalenge=ef69169efa011941301bdbb23b65f1c7a8b12756307e26da4b08fbec0bf628b1&code_chalenge_method=S256
      // https://app.storyblok.com/oauth/authorize?client_id=eEzS/O9kvztN0GVE2pqtJQ==&response_type=code&redirect_uri=http://07d1-69-1-48-73.ngrok.io/auth/callback&scope=read_contentwrite_content&state=8475&code_challenge=SHA256&code_challenge_method=S256
      window.location.assign("https://app.storyblok.com/oauth/app_redirect");
    } else {
      this.loadStories();
      this.$storybridge(() => {
        const storyblokInstance = new StoryBridge();
        // use input event for instant update of content 
        storyblokInstance.on("input", (event) => {
          console.log(this.story.content);
          if (event.story.id === this.story.id) {
            this.story.content = event.story.content
          }
        });
        // use bridge to listen to events 
        storyblokInstance.on(["published", "change"], (event) => {
          this.$nuxt.$router.go({
            path: this.$nuxt.$router.currentRoute,
            force: true,
          });
        });
      });
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
    loadStories() {
      axios
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
        });
    },
    loadStory() {
      axios
        .get(`/auth/explore/spaces/${this.$route.query.space.id}/stories/7038709`)
        .then((res) => {
          this.story = res.data.story;
        });
    },
  },
};
</script>
