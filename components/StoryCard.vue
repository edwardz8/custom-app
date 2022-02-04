<script>
import axios from "axios";

export default {
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  props: ["data"],
  data() {
    return {
      story: {},
    };
  },

  mounted() {
    if (this.data)
      if (!this.data.content.body) {
        this.data.content.body = [];
      }
      this.story = this.data;
  },

  methods: {
    async saveData(publish) {
      let storyData = {
        story: {
          content: this.story.content,
        },
      };

      if (publish) {
        this.story.unpublished_changes = false;
      } else {
        this.story.unpublished_changes = true;
      }

      return axios.put(
        `/auth/spaces/${this.$route.query.space_id}/stories/${this.story.id}`,
        storyData
      );
    },
  },
};
</script>

<template>
  <div class="container mx-auto">
    <div
      :key="story.id"
      v-if="story && story.content"
      class="py-4 px-6 bg-white shadow-md rounded my-2 mx-2"
    >
      <div>
        <label class="block text-gray-800 text-sm font-bold mb-2 mt-2" for="title"
          >Title</label
        >
        <input
          type="text"
          v-model="story.content.seo.title"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
        />
      </div>
      <div>
        <label class="block text-gray-800 text-sm font-bold mb-2 mt-2" for="description"
          >Description</label
        >
        <input
          type="text"
          v-model="story.content.seo.description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
        />
      </div>

      <div class="flex justify-end mt-4">
        <button :disabled="!!story.unpublished_changes"
          class="mx-2 bg-gray-800 hover:bg-blue-900 text-gray-100 py-2 px-4 rounded"
          @click="saveData()"
        >
          Save Draft
        </button>
        <button :disabled="!!story.published"
          class="mx-2 bg-gray-800 hover:bg-blue-900 text-gray-100 py-2 px-4 rounded"
          @click="saveData(true)"
        >
          Publish
        </button>
      </div>
    </div>
  </div>
</template>
