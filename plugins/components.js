import Vue from 'vue'
import Page from '~/components/Page.vue'
import Grid from '~/components/Grid.vue'
import ArticleTeaser from '~/components/ArticleTeaser.vue'
import Teaser from '~/components/Teaser.vue'
import Feature from '~/components/Feature.vue'

Vue.component('teaser', Teaser)
Vue.component('grid', Grid)
Vue.component('page', Page)
Vue.component('article-teaser', ArticleTeaser)
Vue.component('feature', Feature)