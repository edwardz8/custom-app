<script>
import axios from "axios";
import { saveData } from "../lib/utils";

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
      changed: false
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
      const save = await saveData(this.$route.query.space_id, this.story, publish);

      if (save) {
        this.story = save;
        this.changed = true;
        setTimeout(() => {
          this.changed = false;
        }, 2000);
      }
    },
  },
};
</script>

<template>
  <div class="container mx-auto">
    <div v-if="changed" class="bg-gray-700 mt-2">
      <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between flex-wrap">
          <div class="w-0 flex-1 flex items-center">
            <p class="ml-3 font-medium text-white truncate">
              <span>Changes Saved</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      :key="story.id"
      v-if="story && story.content"
      class="py-4 px-6 bg-white shadow-md rounded my-2 mx-2"
    >
      <div>{{ story.name }}</div>
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

      <div class="mt-2 text-green-400">
        {{ story.published ? "Published and" : "Unpublished and"
        }}<span>
          {{ story.unpublished_changes ? "Draft available" : "No draft available" }}
        </span>
      </div>

      <div class="flex justify-end mt-4">
        <button
          class="mx-2 bg-gray-800 hover:bg-blue-900 text-gray-100 py-2 px-4 rounded"
          @click="saveStoryData()"
        >
          Save Draft
        </button>
        <button
          class="mx-2 bg-gray-800 hover:bg-blue-900 text-gray-100 py-2 px-4 rounded"
          @click="saveStoryData(true)"
        >
          Publish
        </button>
      </div>
    </div>
  </div>
</template>
