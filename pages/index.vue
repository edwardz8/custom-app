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
      <story-card
        v-for="story in column.stories"
        :key="story.id"
        :story="story"
        class="mt-3"
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
      story: {},
      stories: [],
      columns: [
        {
          title: "Unpublished",
          stories: [],
        },
        {
          title: "Unpublished Content",
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
      // https://app.storyblok.com/oauth/authorize?client_id=eEzS/O9kvztN0GVE2pqtJQ==&response_type=code&redirect_uri=http://07d1-69-1-48-73.ngrok.io/auth/callback&scope=read_contentwrite_content&state=8475&code_challenge=SHA256&code_challenge_method=S256
      window.location.assign("https://app.storyblok.com/oauth/app_redirect");
    } else {
      this.loadStories();
    }
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
        .get(`/auth/explore/spaces/${this.$route.query.space.id}/stories/79698930`)
        .then((res) => {
          this.story = res.data.story;
        });
    },
  },
};
</script>
