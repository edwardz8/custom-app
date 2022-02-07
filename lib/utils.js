import axios from 'axios'

export const getStories = async (spaceId, pageSize, currentIndex) => {
  let page = await axios.get(`/auth/spaces/${spaceId}/stories?per_page=${pageSize}&page=${currentIndex}`)
  let stories = [];
  await Promise.all(
    page.data.stories.map(story => {
      return axios
        .get(`/auth/spaces/${spaceId}/stories/${story.id}`)
        .then((res) => {
            if (!res.data.story.content.seo) {
              res.data.story.content.seo = {
                title: '',
                description: '',
                plugin: "meta-fields",
              }
            }
            stories.push(JSON.parse(JSON.stringify(res.data.story)));
        })
        .catch((error) => {
          console.log(error);
        })
    })
  )

  return { stories, total: page.data.total }
}

export const saveData = async (spaceId, story, publish) => {
  let storyData = {story: {content: story.content, unpublished_changes: !publish}}

  return axios.put(`/auth/spaces/${spaceId}/stories/${story.id}`, storyData)
}
