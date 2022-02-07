<script>
import axios from "axios";
import { saveData } from '../lib/utils';

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
    async saveStoryData(publish) {
      return saveData(this.$route.query.space_id, this.story, publish)
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
          @click="saveStoryData()"
        >
          Save Draft
        </button>
        <button :disabled="!!story.published"
          class="mx-2 bg-gray-800 hover:bg-blue-900 text-gray-100 py-2 px-4 rounded"
          @click="saveStoryData(true)"
        >
          Publish
        </button>
      </div>
    </div>
  </div>
</template>
