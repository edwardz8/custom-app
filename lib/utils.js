import axios from 'axios'

const util = {
    async getStories() {
      let page = await axios.get(
        `/auth/spaces/${this.$route.query.space_id}/stories?per_page=${this.pageSize}&page=${this.current}`
      );
  
      this.storiesWithData = [];
  
      this.total = page.data.total;
  
      await Promise.all(
        page.data.stories.map((story) => {
          return axios
            .get(`/auth/spaces/${this.$route.query.space_id}/stories/${story.id}`)
            .then((res) => {
                if (!res.data.story.content.seo) {
                  res.data.story.content.seo = {
                    title: "",
                    description: "",
                    plugin: "meta-fields",
                  };
                }
                this.storiesWithData.push(JSON.parse(JSON.stringify(res.data.story)));
            })
            .catch((error) => {
              console.log(error);
            });
        })
      );
    },

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
}

export default util