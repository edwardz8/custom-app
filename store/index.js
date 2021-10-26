export const state = () => ({
  articles: [],
  stories: [],
  loaded: '0',
  spaceId: false,
  toastVisible: false,
  toast: {
    title: 'Loading failed',
    status: 'negative',
    message: '',
  },
})

export const mutations = {
  setArticles(state, entries) {
    state.articles = entries
  },
  setLoaded(state, loaded) {
    state.loaded = loaded
  },
  setSpace(state, spaceId) {
    state.spaceId = spaceId
  },
  setTargetSpace(state, spaceId) {
    state.targetSpace = spaceId
  },
  setStories(state, stories) {
    state.stories = stories
  },
  setToastVisible(state, visible) {
    state.toastVisible = visible
  },
  setToast(state, toastObject) {
    state.toast = Object.assign(state.toast, toastObject)
  },
}
